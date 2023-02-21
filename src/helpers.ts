import { NextFunction, Request, Response } from 'express';
import { AppError } from './interfaces.js';
import moment from 'moment';

export const getEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing: process.env['${name}'].`);
  }

  return value;
};

class HttpError {
  constructor(public status_code: number, public message: string) {
    this.message = message;
    this.status_code = status_code;
  }
}

export const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(`[${moment().toDate()}] ${request.method} url:: ${request.url}`);
  next();
};

export const errorLogger = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log(`[${moment().toDate()}] ERROR: ${error.message}`);
  next(error);
};

export const errorResponder = (
  error: AppError,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const status = error.statusCode || 400;
  response.status(status).json(new HttpError(status, error.message));
  next();
};

export const invalidPathHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.status(404).json(new HttpError(404, 'Path not found'));
};
