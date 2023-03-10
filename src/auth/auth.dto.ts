import Joi from 'joi';
import { UserSchema } from '../users/users.model';

export type RegisterDTO = Pick<UserSchema, 'username' | 'email' | 'password'>;
export const registerSchema = Joi.object<RegisterDTO>({
  username: Joi.string().required(),
  password: Joi.string().min(6).alphanum().required(),
  email: Joi.string().email(),
});

export type LoginDTO = Pick<UserSchema, 'username' | 'password'>;
export const loginSchema = Joi.object<RegisterDTO>({
  username: Joi.string().required(),
  password: Joi.string().min(6).alphanum().required(),
});

export type RefreshDTO = Required<Pick<UserSchema, 'refresh_token'>>;
export const refreshSchema = Joi.object<RefreshDTO>({
  refresh_token: Joi.string().required(),
});
