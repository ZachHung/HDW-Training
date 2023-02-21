import { Router, Express, Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import { AuthRouter } from './auth/auth.route';

dotenv.config();
const route = (app: Express) => {
  app.use('/auth', AuthRouter);
};

export default route;
