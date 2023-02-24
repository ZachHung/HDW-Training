import Joi from 'joi';
export const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).alphanum().required(),
  email: Joi.string().email(),
});

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).alphanum().required(),
});

export interface LoginDTO {
  username: string;
  password: string;
}

export interface RefreshDTO {
  refresh_token: string;
}
export const refreshSchema = Joi.object({
  refresh_token: Joi.string().required(),
});
