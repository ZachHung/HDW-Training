import { NextFunction, Request, Response } from 'express';
import { AppError } from '../helpers/error';
import logger from '../../config/logger';

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} URL:: ${req.url}`);
  next();
};

export const errorLogger = (
  error: Error | AppError,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (error instanceof AppError && error.status_code >= 500) {
    logger.error(error);
  }
  next(error);
};
