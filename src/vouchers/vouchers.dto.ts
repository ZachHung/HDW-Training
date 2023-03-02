import Joi from 'joi';

export type CreateVoucherDTO = {
  event_id: string;
};
export const createVoucherSchema = Joi.object().keys({
  event_id: Joi.string().required(),
});
