import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(
    `[${moment().utcOffset(0, true).toDate()}] ${request.method} URL:: ${request.url}`,
  );
  next();
};

export const errorLogger = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(`[${moment().utcOffset(0, true).toDate()}] ERROR: ${error.message}`);
  next(error);
};
