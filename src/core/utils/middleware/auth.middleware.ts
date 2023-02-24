import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../../../user/user.model';
import { getEnv } from '../helpers/get-env';
import * as dotenv from 'dotenv';
import { createError } from '../helpers/error';
import { Roles } from '../types/enum';
dotenv.config();

export interface CustomRequest extends Request {
  user: IUser & { _id: string };
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader) throw Error;
    const token = authHeader.split(' ')[1];

    const userData = jwt.verify(token, getEnv('JWT_SECRET'));
    (req as CustomRequest).user = userData as IUser & { _id: string };
    next();
  } catch (error) {
    throw createError(401, 'You are not authenticated');
  }
};
export const auth =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const customRequest = req as CustomRequest;
    verifyToken(req, res, () => {
      if (
        roles.some(
          (role) => role === customRequest.user.role || customRequest.user.role === Roles.ADMIN,
        )
      ) {
        next();
      } else throw Error;
    });
  };
