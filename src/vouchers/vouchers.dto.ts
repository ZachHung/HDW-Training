import Joi from 'joi';

export type GetVoucherDTO = {
  event_id: string;
};

export type CreateVoucherDTO = {
  event_id: string;
  quantity: number;
};
export const getVoucherSchema = Joi.object<GetVoucherDTO>({
  event_id: Joi.string().min(24).required(),
});

export const createVoucherSchema = Joi.object<CreateVoucherDTO>({
  event_id: Joi.string().min(24).required(),
  quantity: Joi.number().min(1).required(),
});
