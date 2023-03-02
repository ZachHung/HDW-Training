import { NextFunction, Request, Response } from 'express';
import { AppError } from '../helpers/error';
import logger from '../../config/logger';

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} URL:: ${req.url}`);
  next();
};
