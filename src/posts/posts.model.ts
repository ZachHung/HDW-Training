import mongoose, { model, Types } from 'mongoose';
import { MongoBaseSchema } from '../core/utils/types/mongo.base.interface';
import { UserSchema, User } from '../users/users.model';
const { Schema } = mongoose;

export interface PostSchema extends MongoBaseSchema {
  user_id?: UserSchema;
  title: string;
  content: string;
}

const postSchema = new Schema<PostSchema>(
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

const Post = model<PostSchema>('Post', postSchema);
export { postSchema, Post };
