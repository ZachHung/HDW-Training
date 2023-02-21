import { Router, Express, Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import { UserRouter } from './routes';
dotenv.config();
const route = (app: Express) => {
  app.use('/users', UserRouter);
};

export default route;
