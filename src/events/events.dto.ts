import Joi from 'joi';
import { EventSchema } from './events.model';

export type CreateEventDTO = Pick<EventSchema, 'name' | 'max_quantity'>;
export const createEventSchema = Joi.object<CreateEventDTO>({
  name: Joi.string().required(),
  max_quantity: Joi.number().min(1).required(),
});

export type EditEventDTO = {
  event_id: string;
};
export const editEventSchema = Joi.object<EditEventDTO>({
  event_id: Joi.string().min(24),
});
