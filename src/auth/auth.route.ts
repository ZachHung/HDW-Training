import express from 'express';
import { AuthController } from './auth.controller';

const AuthRouter = express.Router();
const authController = new AuthController();

AuthRouter.post('/', authController.create);
AuthRouter.post('/login', authController.login);

export { AuthRouter };
