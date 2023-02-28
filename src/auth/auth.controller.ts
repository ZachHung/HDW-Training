import { Request as ExRequest, Response, NextFunction } from 'express';
import { Body, Controller, Get, Post, Request, Route, Security } from 'tsoa';
import { AuthRoutes } from '../core/utils/constants/api';
import { Roles } from '../core/utils/constants/roles';
import { createResponse, HttpResponse } from '../core/utils/helpers/response';
import { validate } from '../core/utils/helpers/validate';
import { CustomRequest } from '../core/utils/middleware/auth.middleware';
import { UserService } from '../users/user.service';
import { IUser } from '../users/users.model';
import {
  LoginDTO,
  loginSchema,
  RefreshDTO,
  refreshSchema,
  RegisterDTO,
  registerSchema,
} from './auth.dto';
import { AuthService } from './auth.service';

@Route('auth')
export class AuthController extends Controller {
  @Post(AuthRoutes.POST_REGISTER)
  async create(@Body() body: RegisterDTO): Promise<HttpResponse<IUser>> {
    const payload = validate<RegisterDTO>(body, registerSchema);
    const newUser = await new AuthService().register(payload);
    return createResponse(this, newUser, 201);
  }

  @Post(AuthRoutes.POST_LOGIN)
  async login(@Body() body: LoginDTO): Promise<
    HttpResponse<{
      accessToken: string;
      refreshToken: string;
    }>
  > {
    const payload = validate<LoginDTO>(body, loginSchema);
    const result = await new AuthService().login(payload);
    return createResponse(this, result);
  }

  @Security('jwt', [Roles.CUSTOMER])
  @Get(AuthRoutes.GET_ME)
  async getMe(@Request() req: CustomRequest): Promise<HttpResponse<IUser>> {
    const { user } = req;
    return createResponse(this, user);
  }

  @Security('jwt', [Roles.ADMIN])
  @Get(AuthRoutes.GET_ALL_USERS)
  async getAll(@Request() req: CustomRequest): Promise<HttpResponse<IUser[]>> {
    const result = await new UserService().getAll();
    return createResponse(this, result);
  }

  @Post(AuthRoutes.POST_TOKEN)
  async refreshToken(@Body() body: RefreshDTO): Promise<
    HttpResponse<{
      accessToken: string;
      refreshToken: string;
    }>
  > {
    const payload = validate<RefreshDTO>(body, refreshSchema);
    const result = await new AuthService().refreshToken(payload);
    return createResponse(this, result);
  }
}
