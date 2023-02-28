import Joi from 'joi';
import { IVoucher } from './vouchers.model';

export type CreateVoucherDTO = {
  event_id: string;
};
export const createVoucherSchema = Joi.object().keys({
  event_id: Joi.string().required(),
});
