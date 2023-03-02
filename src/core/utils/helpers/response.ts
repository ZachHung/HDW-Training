import { Controller } from 'tsoa';
import logger from '../../config/logger';

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
  const response = new HttpResponse(statusCode, data);
  return response;
};
