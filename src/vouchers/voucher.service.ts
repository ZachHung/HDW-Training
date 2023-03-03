import mongoose from 'mongoose';
import logger from '../core/config/logger';
import { AppError, createError } from '../core/utils/helpers';
import { Event } from '../events/events.model';
import { CreateVoucherDTO } from './vouchers.dto';
import { IVoucher, Voucher } from './vouchers.model';
import { setTimeout } from 'timers/promises';
import { DELAY_TIME, MAX_RETRY_COUNT } from '../core/utils/constants/voucher';
import { emailQueue } from '../core/queues/email.queue';
import { VoucherMailTemplate } from '../core/utils/types/mail.template.type';

export class VoucherService {
  async create(data: CreateVoucherDTO, user_id: string): Promise<IVoucher[]> {
    const isEventExist = await Event.findById(data.event_id).lean();
    if (!isEventExist) throw createError(404, 'Event not found');

    // Start session
    const session = await mongoose.startSession();
    let voucherList: IVoucher[] = [];

    for (let i = 0; i <= MAX_RETRY_COUNT; ++i) {
      try {
        if (i === MAX_RETRY_COUNT) {
          throw createError(408, 'Request timeout');
        }
        session.startTransaction();
        const event = await Event.findOneAndUpdate(
          { $expr: { $and: [{ $lt: ['$issued', '$max_quantity'] }, { _id: data.event_id }] } },
          { $inc: { issued: 1 } },
          { runValidators: true, session },
        );
        if (!event) throw createError(456, 'Maximum voucher reached');

        voucherList = await Voucher.create([{ ...data, user_id }], {
          session: session,
          new: true,
        });

        await session.commitTransaction();
        // await session.endSession();

        break;
      } catch (error) {
        await session.abortTransaction();

        if (
          !(error instanceof AppError && (error.status_code === 456 || error.status_code === 408))
        ) {
          await setTimeout(DELAY_TIME);
          logger.info('Retrying');
          continue;
        }
        // await session.endSession();
        throw error;
      } finally {
        await session.endSession();
      }
    }
    // Activate VOucher
    const voucher: IVoucher = await Voucher.findOneAndUpdate(
      { event_id: data.event_id, user_id: user_id, active: false },
      { $set: { active: true } },
      { runValidators: true },
    )
      .populate('event_id user_id')
      .lean();
    if (!voucher) throw createError(404, 'Voucher not found');

    // createEmailJob
    const jobData: VoucherMailTemplate & { to: string } = {
      Code: voucher._id,
      CompanyName: '13Team',
      Discount: 15,
      FirstName: voucher.user_id?.username || '',
      to: voucher.user_id?.email || '',
    };
    await emailQueue.add('email', jobData);
    return voucherList;
  }
}
