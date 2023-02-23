import { Response } from 'express';

class HttpResponse<T> {
  status_code: number;
  message: string;
  data: T;

  constructor(statusCode: number, message: string, data: T) {
    this.status_code = statusCode;
    this.message = message;
    this.data = data;
  }
}

export const createResponse = <T>(
  res: Response,
  data: T,
  message = 'Successful',
  statusCode = 200,
) => {
  return res.status(statusCode).json(new HttpResponse(statusCode, message, data));
};
