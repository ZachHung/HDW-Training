import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { createError } from '../core/utils/helpers/error';
import { LoginDTO, RefreshDTO, RegisterDTO } from './auth.dto';
import { IUser, User } from '../users/users.model';
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
    const result = await User.findOneAndUpdate(query, update, options).select({
      password: 0,
    });
    if (result.lastErrorObject?.updatedExisting) throw createError(400, 'User already exist');

    const serializedUser = result.value?.toJSON() as IUser;
    return serializedUser;
  }

  async login(loginDTO: LoginDTO) {
    const query: FilterQuery<IUser> = {
      $or: [{ username: loginDTO.username }, { email: loginDTO.username }],
    };
    const user = await User.findOne(query).lean();

    if (!user) throw createError(401, 'Wrong credentials');
    const isPassValid = await bcrypt.compare(loginDTO.password, user.password);
    if (!isPassValid) throw createError(401, 'Wrong credentials');

    const { password, refresh_token, ...serializedUser } = user;
    const payload = serializedUser;
    const accessToken = jwt.sign(payload, getEnv('JWT_SECRET'), {
      expiresIn: getEnv('JWT_EXP_IN'),
    });
    const refreshToken = jwt.sign(payload, getEnv('REFRESH_SECRET'), {
      expiresIn: getEnv('REFRESH_EXP_IN'),
    });

    await User.findByIdAndUpdate(user._id, { $set: { refresh_token: refreshToken } });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshDTO: RefreshDTO) {
    try {
      const { refresh_token } = refreshDTO;
      const userData = jwt.verify(refresh_token, getEnv('REFRESH_SECRET')) as IUser & {
        iat: number;
        exp: number;
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iat, exp, ...payload } = userData;
      const newAccessToken = jwt.sign(payload, getEnv('JWT_SECRET'), {
        expiresIn: getEnv('JWT_EXP_IN'),
      });
      const newRefreshToken = jwt.sign(payload, getEnv('REFRESH_SECRET'), {
        expiresIn: getEnv('REFRESH_EXP_IN'),
      });
      await User.findOneAndUpdate(
        { _id: userData._id },
        {
          $set: { refresh_token: newRefreshToken },
        },
      );
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
      throw createError(401, 'Invalid Token');
    }
  }
}
