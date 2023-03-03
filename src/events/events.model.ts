import mongoose, { model, Types } from 'mongoose';
import { MongoBaseSchema } from '../core/utils/types/mongo.base.interface';
import { IUser, User } from '../users/users.model';
const { Schema } = mongoose;

export interface IEvent extends MongoBaseSchema {
  name: string;
  max_quantity: number;
  issued: number;
  editAt?: Date;
  editBy?: IUser;
}

const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    max_quantity: { type: Number, required: true, default: 1, min: 1 },
    issued: { type: Number, default: 0, min: 0 },
    editAt: { type: Date, default: null },
    editBy: { type: Types.ObjectId, ref: User },
  },
  { collection: 'events' },
);

export const Event = model<IEvent>('Event', eventSchema);
export { eventSchema };
