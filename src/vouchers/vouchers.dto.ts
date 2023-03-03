import Joi from 'joi';

export type CreateVoucherDTO = {
  event_id: string;
};
export const createVoucherSchema = Joi.object<CreateVoucherDTO>({
  event_id: Joi.string().required(),
});
