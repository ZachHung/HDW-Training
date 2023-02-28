import mongoose, { model, Types } from 'mongoose';
import { MongoBaseSchema } from '../core/utils/types/mongo.base.interface';
import { IUser, User } from '../users/users.model';
const { Schema } = mongoose;

export interface IPost extends MongoBaseSchema {
  user_id?: IUser;
  title: string;
  content: string;
}

const postSchema = new Schema<IPost>(
  {
    user_id: {
      type: Types.ObjectId,
      ref: User,
      populate: { path: 'user_id', select: '-password -refresh_token' },
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { collection: 'posts' },
);

const Post = model<IPost>('Post', postSchema);
export { postSchema, Post };
