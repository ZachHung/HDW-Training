import { Request, Response, NextFunction } from 'express';
export class UserController {
  create(req: Request, res: Response, next: NextFunction) {
    console.log('❤');
  }
}
