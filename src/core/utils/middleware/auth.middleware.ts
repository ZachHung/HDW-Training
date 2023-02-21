import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../../../user/user.model';
import { getEnv } from '../helpers/get-env';
import { createError } from './error.middleware';
import * as dotenv from 'dotenv';
dotenv.config();

export interface CustomRequest extends Request {
  user: HydratedDocument<IUser>;
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader) throw Error;
    const token = authHeader.split(' ')[1];

    const userData = jwt.verify(token, getEnv('SECRET_KEY'));
    (req as CustomRequest).user = userData as HydratedDocument<IUser>;
    next();
  } catch (error) {
    throw createError(401, 'You are not authenticated');
  }
};
export const authentication =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
      if (
        (req as CustomRequest).user.id === (req as CustomRequest).params.userID ||
        !roles.some((role) => role === (req as CustomRequest).user.role)
      ) {
        next();
      } else throw createError(403, "You don't have the right to do that");
    });
  };
