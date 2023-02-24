import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  console.log(`[${moment().format('LTS  DD-MM-YYYY')}] ${request.method} URL:: ${request.url}`);
  next();
};

export const errorLogger = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(`[${moment().format('LTS  DD-MM-YYYY')}] ERROR: ${error.message}`);
  next(error);
};
