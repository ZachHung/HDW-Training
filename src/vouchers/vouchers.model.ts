import mongoose, { model, Types } from 'mongoose';
import { MongoBaseSchema } from '../core/utils/types/mongo.base.interface';
import { IEvent } from '../events/events.model';
import { IUser, User } from '../users/users.model';
const { Schema } = mongoose;

export interface IVoucher extends MongoBaseSchema {
  event_id?: IEvent;
  active: boolean;
  user_id?: IUser;
}

const voucherSchema = new Schema<IVoucher>(
  {
    event_id: { type: Types.ObjectId, ref: Event },
    active: { type: Boolean, default: false },
    user_id: { type: Types.ObjectId, ref: User },
  },
  { collection: 'vouchers' },
);

export const Voucher = model<IVoucher>('Voucher', voucherSchema);
export { voucherSchema };
