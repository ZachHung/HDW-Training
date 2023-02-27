import Joi from 'joi';
import { IUser } from '../users/users.model';

export type RegisterDTO = Pick<IUser, 'username' | 'email' | 'password'>;
export const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).alphanum().required(),
  email: Joi.string().email(),
});

export type LoginDTO = Pick<IUser, 'username' | 'password'>;
export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).alphanum().required(),
});

export type RefreshDTO = Required<Pick<IUser, 'refresh_token'>>;
export const refreshSchema = Joi.object({
  refresh_token: Joi.string().required(),
});
