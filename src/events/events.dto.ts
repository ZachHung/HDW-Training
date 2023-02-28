import Joi from 'joi';
import { IEvent } from './events.model';

export type CreateEventDTO = Pick<IEvent, 'name' | 'max_quantity'>;
export const createEventSchema = Joi.object({
  name: Joi.string().required(),
  max_quantity: Joi.number().min(1).required(),
});
