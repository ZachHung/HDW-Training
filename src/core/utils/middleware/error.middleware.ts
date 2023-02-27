import { NextFunction, Request, Response } from 'express';
import { ValidateError } from 'tsoa';
import { AppError, createError } from '../helpers/error';

export const errorResponder = (
  error: AppError | ValidateError,
  _request: Request,
  _response: Response,
  _next: NextFunction,
): Response | void => {
  if (error instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${_request.path}:`, error.fields);
    return _response.status(422).json({
      message: 'Validation Failed',
      details: error?.fields,
    });
  }

  const status = error.status_code || 500;

  if (status === 500) {
    console.log(error);
    return;
  } else {
    return _response.status(status).send(error);
  }
};

export const invalidPathHandler = (_request: Request, response: Response, _next: NextFunction) => {
  response.status(404).json(createError(404, 'Path not found'));
};
