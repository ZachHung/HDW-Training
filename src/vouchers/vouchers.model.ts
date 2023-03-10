import mongoose, { model, Types } from 'mongoose';
import { MongoBaseSchema } from '../core/utils/types/mongo.base.interface';
import { EventSchema } from '../events/events.model';
import { UserSchema, User } from '../users/users.model';
const { Schema } = mongoose;

export interface VoucherSchema extends MongoBaseSchema {
  event_id?: EventSchema;
  active: boolean;
  user_id?: UserSchema;
}

const voucherSchema = new Schema<VoucherSchema>(
  {
    event_id: { type: Types.ObjectId, ref: Event },
    active: { type: Boolean, default: false },
    user_id: { type: Types.ObjectId, ref: User },
  },
  { collection: 'vouchers' },
);

export const Voucher = model<VoucherSchema>('Voucher', voucherSchema);
export { voucherSchema };
