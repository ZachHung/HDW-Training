import mongoose, { model, Types } from 'mongoose';
import { MongoBaseSchema } from '../core/utils/types/mongo.base.interface';
import { UserSchema, User } from '../users/users.model';
const { Schema } = mongoose;

export interface EventSchema extends MongoBaseSchema {
  name: string;
  max_quantity: number;
  in_stock?: number;
  editAt?: Date;
  editBy?: UserSchema;
}

const eventSchema = new Schema<EventSchema>(
  {
    name: { type: String, required: true },
    max_quantity: { type: Number, required: true, default: 10, min: 1 },
    in_stock: { type: Number, default: 10, min: 0 },
    editAt: { type: Date, default: null },
    editBy: { type: Types.ObjectId, ref: User },
  },
  { collection: 'events' },
);

export const Event = model<EventSchema>('Event', eventSchema);
export { eventSchema };
