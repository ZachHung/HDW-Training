import mongoose, { model, Types } from 'mongoose';
import { Roles } from '../core/utils/types/enum';
import { User } from '../user/user.model';
const { Schema } = mongoose;

export interface IPost {
  user_id?: Types.ObjectId;
  title: string;
  content: string;
}

const postSchema = new Schema<IPost>(
  {
    user_id: { type: Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { collection: 'posts' },
);

const Post = model<IPost>('Post', postSchema);
export { postSchema, Post };
