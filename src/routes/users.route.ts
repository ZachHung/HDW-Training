import express, { Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers';

const UserRouter = express.Router();
const userController = new UserController();

UserRouter.get('/', userController.create);

export { UserRouter };
