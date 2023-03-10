import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserSchema } from '../../../users/users.model';
import { getEnv } from '../helpers/get-env';
import * as dotenv from 'dotenv';
import { createError } from '../helpers/error';
import { Roles } from '../constants/roles';
dotenv.config();

export type CustomRequest = Request & {
  user: UserSchema;
};

export const expressAuthentication = (request: Request, securityName: string, roles: string[]) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.split(' ')[1] || securityName !== 'jwt')
    return Promise.reject(createError(401, 'You are not authenticated'));

  return new Promise((resolve, reject) => {
    jwt.verify(authHeader.split(' ')[1], getEnv('JWT_SECRET'), {}, (err, decoded) => {
      if (err !== null || decoded === undefined || typeof decoded === 'string')
        return reject(createError(401, 'Invalid Token'));
      const customRequest = request as CustomRequest;
      customRequest.user = decoded as UserSchema;

      // TODO: check if is the author then 403
      // if (!roles.includes(Roles.OP) || customRequest.user._id !== )
      // return reject(createError(403, "You don't have the rights to do that"));

      if (
        !roles.some(
          (role) => role === customRequest.user.role || customRequest.user.role === Roles.ADMIN,
        )
      )
        return reject(createError(403, "You don't have the rights to do that"));

      resolve(decoded);
    });
  });
};
