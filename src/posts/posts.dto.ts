import Joi from 'joi';
import { PostSchema } from './posts.model';

export type CreatePostDTO = Pick<PostSchema, 'title' | 'content'>;
export const createPostSchema = Joi.object<CreatePostDTO>({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

export type UpdatePostDTO = CreatePostDTO;
export const updatePostSchema = createPostSchema;
