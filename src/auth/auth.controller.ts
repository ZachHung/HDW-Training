import { Request, Response, NextFunction } from 'express';
import { createResponse } from '../core/utils/helpers/response';
import { validate } from '../core/utils/helpers/validate';
import { CustomRequest } from '../core/utils/middleware/auth.middleware';
import { UserService } from '../users/user.service';
import {
  LoginDTO,
  loginSchema,
  RefreshDTO,
  refreshSchema,
  RegisterDTO,
  registerSchema,
} from './auth.dto';
import { AuthService } from './auth.service';

export class AuthController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = validate<RegisterDTO>(req.body, registerSchema);
      const newUser = await new AuthService().register(payload);
      createResponse(res, newUser, 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = validate<LoginDTO>(req.body, loginSchema);
      const result = await new AuthService().login(payload);
      createResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req as CustomRequest;
      createResponse(res, user);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await new UserService().getAll();
      createResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = validate<RefreshDTO>(req.body, refreshSchema);
      const result = await new AuthService().refreshToken(payload);
      createResponse(res, result);
    } catch (error) {
      next(error);
    }
  }
}
