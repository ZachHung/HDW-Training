import mongoose, { model, Types } from 'mongoose';
import { MongoBaseSchema } from '../core/utils/types/mongo.base.interface';
const { Schema } = mongoose;

export interface IEvent extends MongoBaseSchema {
  name: string;
  max_quantity: number;
  issued: number;
}

const eventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    max_quantity: { type: Number, required: true, default: 1, min: 1 },
    issued: { type: Number, default: 0, min: 0 },
  },
  { collection: 'events' },
);

export const Event = model<IEvent>('Event', eventSchema);
export { eventSchema };
