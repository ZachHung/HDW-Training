import { NextFunction, Request, Response } from 'express';
import { AppError, createError } from '../helpers/error';

export const errorResponder = (
  error: AppError,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const status = error.status_code || 500;
  if (status === 500) {
    console.log(error);
  } else {
    response.status(status).send(error);
  }
};

export const invalidPathHandler = (request: Request, response: Response, next: NextFunction) => {
  response.status(404).json(createError(404, 'Path not found'));
};
