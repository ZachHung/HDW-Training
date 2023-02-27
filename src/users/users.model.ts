import mongoose, { model, Types } from 'mongoose';
import { Roles } from '../core/utils/constants/roles';
import { MongoBaseSchema } from '../core/utils/types/mongo.base.interface';
const { Schema } = mongoose;

export interface IUser extends MongoBaseSchema {
  username: string;
  password: string;
  email: string;
  role?: Roles;
  refresh_token?: string;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, default: 'CUSTOMER', enum: Roles },
    refresh_token: String,
  },
  { collection: 'users' },
);

export const User = model<IUser>('User', userSchema);
export { userSchema };
