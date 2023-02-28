import mongoose from 'mongoose';
import { createError } from '../core/utils/helpers/error';
import { Event } from '../events/events.model';
import { CreateVoucherDTO } from './voucher.dto';
import { IVoucher, Voucher } from './vouchers.model';

export class VoucherService {
  async create(data: CreateVoucherDTO, user_id: string): Promise<IVoucher[]> {
    // const event = await Event.findById(data.event_id).lean();

    // Start session
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const voucherDoc = await Voucher.create([{ ...data, user_id }], {
        session: session,
        new: true,
      });

      const event = await Event.findOneAndUpdate(
        { _id: voucherDoc[0].event_id },
        { $inc: { issued: 1 } },
        { runValidators: true, session },
      );

      if (!event) throw createError(404, 'Event does not exist');

      if (event.max_quantity - event.issued <= 0)
        throw createError(422, 'Maximum vouchers reached');

      await session.commitTransaction();

      return voucherDoc;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
    // do something ...
  }
}
