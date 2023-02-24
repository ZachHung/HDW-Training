import express from 'express';
import { auth } from '../core/utils/middleware/auth.middleware';
import { Roles } from '../core/utils/types/enum';
import { AuthController } from './auth.controller';

const AuthRouter = express.Router();
const authController = new AuthController();

AuthRouter.post('', authController.create);
AuthRouter.get('', auth(Roles.CUSTOMER), authController.getMe);
AuthRouter.get('/all', auth(Roles.ADMIN), authController.getAll);
AuthRouter.post('/login', authController.login);
AuthRouter.post('/refresh-token', authController.refreshToken);

export { AuthRouter };
