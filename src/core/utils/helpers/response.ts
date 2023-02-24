import { Response } from 'express';

class HttpResponse<T> {
  status_code: number;
  data: T;

  constructor(statusCode: number, data: T) {
    this.status_code = statusCode;
    this.data = data;
  }
}

export const createResponse = <T>(res: Response, data: T, statusCode = 200) => {
  return res.status(statusCode).json(new HttpResponse(statusCode, data));
};
