import { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
  status_code: number;
  data: Record<string, unknown>;

  constructor(status_code: number, message: string, data: Record<string, unknown>) {
    super();
    this.message = message;
    this.status_code = status_code;
    this.data = data;
  }
}

export const createError = (
  status_code: number,
  message: string,
  data: Record<string, unknown> = {},
): AppError => {
  return new AppError(status_code, message, data);
};

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

export const invalidPathHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.status(404).json(createError(404, 'Path not found'));
};
