import { Request, Response, NextFunction } from 'express';
import { validate } from '../core/utils/helpers/validate';
import { LoginDTO, loginSchema, RegisterDTO, registerSchema } from './auth.dto';
import { AuthService } from './auth.service';

const authService = new AuthService();
export class AuthController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = validate<RegisterDTO>(req.body, registerSchema);
      const newUser = await authService.register(payload);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = validate<LoginDTO>(req.body, loginSchema);
      const result = await authService.login(payload);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
