import express from 'express';
import { Roles } from '../core/utils/constants/roles';
import { auth } from '../core/utils/middleware/auth.middleware';
import { AuthController } from './auth.controller';

const AuthRouter = express.Router();

AuthRouter.post('', new AuthController().create);
AuthRouter.get('', auth(Roles.CUSTOMER), new AuthController().getMe);
AuthRouter.get('/all', auth(Roles.ADMIN), new AuthController().getAll);
AuthRouter.post('/login', new AuthController().login);
AuthRouter.post('/refresh-token', new AuthController().refreshToken);

export { AuthRouter };
