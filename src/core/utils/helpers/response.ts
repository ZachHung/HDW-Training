import { Response } from 'express';
import { Controller } from 'tsoa';

export class HttpResponse<T> {
  status_code: number;
  data: T;

  constructor(statusCode: number, data: T) {
    this.status_code = statusCode;
    this.data = data;
  }
}

export const createResponse = <T, C extends Controller>(
  controller: C,
  data: T,
  statusCode = 200,
) => {
  controller.setStatus(statusCode);
  return new HttpResponse(statusCode, data);
};
