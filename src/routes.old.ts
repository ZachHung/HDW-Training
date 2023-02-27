import { Router, Express, Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import { AuthRouter } from './auth/auth.route';
import { PostRouter } from './posts/posts.route';

dotenv.config();
const route = (app: Express) => {
  app.use('/auth', AuthRouter);
  app.use('/posts', PostRouter);
};

export default route;
