import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { createError } from '../core/utils/middleware/error.middleware';
import { LoginDTO, RegisterDTO } from './auth.dto';
import { IUser, User } from '../user/user.model';
import * as dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import { getEnv } from '../core/utils/helpers/get-env';
import jwt from 'jsonwebtoken';

export class AuthService {
  async register(registerDTO: RegisterDTO) {
    const query: FilterQuery<IUser> = {
      $or: [{ username: registerDTO.username }, { email: registerDTO.email }],
    };
    registerDTO.password = await bcrypt.hash(registerDTO.password, +getEnv('SALT_ROUND'));
    const update: UpdateQuery<IUser> = registerDTO;
    const options: QueryOptions & { rawResult: true } = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      rawResult: true,
    };
    const result = await User.findOneAndUpdate(query, update, options);
    if (result.lastErrorObject?.updatedExisting)
      throw createError(400, 'User already exist');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...serializedUser } = result.value?.toJSON() as IUser;
    return serializedUser;
  }

  async login(loginDTO: LoginDTO) {
    const query: FilterQuery<IUser> = {
      $or: [
        { username: loginDTO.username_or_email },
        { email: loginDTO.username_or_email },
      ],
    };
    const user: IUser = await User.findOne(query).lean();
    if (!user) throw createError(401, 'Wrong credentials');
    const isPassValid = await bcrypt.compare(loginDTO.password, user.password);
    if (!isPassValid) createError(401, 'Wrong credentials');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...serializedUser } = user;
    const payload: Omit<IUser, 'password'> = serializedUser;
    const accessToken = jwt.sign(payload, getEnv('JWT_SECRET'), {
      expiresIn: getEnv('JWT_EXP_IN'),
    });
    return accessToken;
  }
}
