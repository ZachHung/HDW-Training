import { NextFunction, Request, Response } from 'express';
import { ValidateError } from 'tsoa';
import { AppError, createError } from '../helpers/error';
import logger from '../../config/logger';
import { errorToJSON } from 'bullmq';

export const errorResponder = (
  error: unknown,
  _request: Request,
  _response: Response,
  _next: NextFunction,
): Response | void => {
  if (error instanceof ValidateError) {
    logger.warn(`Caught Validation Error for ${_request.path}:`, error.fields);
    logger.error(
      JSON.stringify(
        _response.status(422).json({
          message: 'Validation Failed',
          details: error?.fields,
        }),
      ),
    );
    return _response.status(422).json({
      message: 'Validation Failed',
      details: error?.fields,
    });
  }
  if (error instanceof AppError) {
    const status = error?.status_code || 500;
    // console.log(error);
    logger.error(error);
    return _response.status(status).json(error);
  }
  logger.error(`Uncaught Error\n${errorToJSON(error)}`);
};

export const invalidPathHandler = (
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  response.status(404).json(createError(404, 'Path not found'));
};
