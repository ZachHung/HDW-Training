import Joi from 'joi';
import { createError } from './error';

export const validate = <T>(
  object: object,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {},
): T => {
  const { error, value } = schema.validate(object, { abortEarly: false, ...options });

  if (error) {
    const errorDetails = error.details.map((detail) => {
      const { message, path } = detail;
      const [field] = [...path];
      return { message, field };
    });

    const errResponse: Record<string, string> = {};

    errorDetails.forEach((err) => {
      errResponse[err.field as string] = err.message;
    });
    throw createError(400, 'Validation Failed', errResponse);
  }
  return value;
};
