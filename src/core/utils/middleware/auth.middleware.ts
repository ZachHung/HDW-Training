import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../../../users/users.model';
import { getEnv } from '../helpers/get-env';
import * as dotenv from 'dotenv';
import { createError } from '../helpers/error';
import { Roles } from '../constants/roles';
dotenv.config();

export type CustomRequest = Request & {
  user: IUser;
};

// const verifyToken = (req: Request, _res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;
//   try {
//     if (!authHeader) throw Error;
//     const token = authHeader.split(' ')[1];

//     const userData = jwt.verify(token, getEnv('JWT_SECRET')) as IUser;
//     (req as CustomRequest).user = userData;
//     next();
//   } catch (error) {
//     throw createError(401, 'You are not authenticated');
//   }
// };
export const expressAuthentication = (request: Request, securityName: string, roles: string[]) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.split(' ')[1] || securityName !== 'jwt')
    return Promise.reject(createError(401, 'You are not authenticated'));

  return new Promise((resolve, reject) => {
    jwt.verify(authHeader.split(' ')[1], getEnv('JWT_SECRET'), {}, (err, decoded) => {
      if (err !== null || decoded === undefined || typeof decoded === 'string')
        return reject(createError(401, 'Invalid Token'));
      const customRequest = request as CustomRequest;
      customRequest.user = decoded as IUser;
      if (
        !roles.some(
          (role) => role === customRequest.user.role || customRequest.user.role === Roles.ADMIN,
        )
      )
        return reject(createError(403, "You don't have the rights to do that"));

      resolve(decoded);
    });
  });

  // (req: Request, res: Response, next: NextFunction) => {
  // const customRequest = req as CustomRequest;
  // verifyToken(req, res, () => {
  //   if (
  //     roles.some(
  //       (role) => role === customRequest.user.role || customRequest.user.role === Roles.ADMIN,
  //     )
  //   ) {
  //     next();
  //   } else throw Error;
  // });
};
