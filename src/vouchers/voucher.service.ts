import mongoose from 'mongoose';
import logger from '../core/config/logger';
import { AppError, createError } from '../core/utils/helpers';
import { Event } from '../events/events.model';
import { CreateVoucherDTO } from './vouchers.dto';
import { VoucherSchema, Voucher } from './vouchers.model';
import { setTimeout } from 'timers/promises';
import { DELAY_TIME, MAX_RETRY_COUNT } from '../core/utils/constants/voucher';
import { emailQueue } from '../core/queues/email.queue';

export class VoucherService {
  async create(data: CreateVoucherDTO): Promise<VoucherSchema[]> {
    const isEventExist = await Event.findById(data.event_id).lean();
    if (!isEventExist) throw createError(404, 'Event not found');

    // Start session
    const session = await mongoose.startSession();
    let voucherList: VoucherSchema[] = [];

    // TODO: Research Atomicity of updateMany and/or update in bulk in mongoDB/mongoose
    for (let i = 0; i <= MAX_RETRY_COUNT; ++i) {
      try {
        if (i === MAX_RETRY_COUNT) {
          throw createError(408, 'Request timeout');
        }
        session.startTransaction();

        const updatedEvent = await Event.findOneAndUpdate(
          { _id: data.event_id, in_stock: { $gte: data.quantity } },
          { $inc: { in_stock: -data.quantity } },
          { runValidators: true, session },
        );
        if (!updatedEvent) throw createError(456, 'Maximum voucher reached');

        voucherList = await Voucher.create(
          [
            ...new Array(data.quantity).fill(undefined).map(() => {
              return { ...data };
            }),
          ],
          {
            session,
            new: true,
          },
        );

        await session.commitTransaction();
        await session.endSession();
        break;
      } catch (error) {
        await session.abortTransaction();

        if (!(error instanceof AppError)) {
          await setTimeout(2 ** i * DELAY_TIME);
          logger.info('Retrying');
          continue;
        }
        await session.endSession();
        throw error;
      }
    }

    return voucherList;
  }

  async getVoucher(event_id: string, user_id: string): Promise<VoucherSchema> {
    const voucher = await Voucher.findOneAndUpdate(
      { event_id, user_id: null, active: false },
      { $set: { user_id, active: true } },
      { new: true },
    )
      .populate('user_id')
      .lean();

    if (!voucher) throw createError(404, 'Voucher Not Found');
    // add sent mail job to queue
    emailQueue.add('email', {
      Code: (voucher as VoucherSchema)._id,
      CompanyName: '13Team',
      Discount: 15,
      FirstName: (voucher as VoucherSchema).user_id?.username || '',
      to: (voucher as VoucherSchema).user_id?.email || '',
    });
    return voucher;
  }

  async deActivateVoucher(voucher_id: string): Promise<VoucherSchema> {
    const voucher = await Voucher.findOneAndUpdate(
      { _id: voucher_id },
      { $set: { active: false } },
    );
    if (!voucher) throw createError(500, 'Voucher Not Found');
    return voucher;
  }
}
