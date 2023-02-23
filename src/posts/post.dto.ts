import Joi from 'joi';
export interface CreatePostDTO {
  title: string;
  content: string;
}
export const createPostSchema = Joi.object().keys({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

export interface getPostDTO {
  id: string;
}
export const getPostSchema = Joi.object({
  id: Joi.string().min(24).required(),
});

export interface UpdatePostDTO extends getPostDTO {
  title: string;
  content: string;
}
export const updatePostSchema = getPostSchema.keys({
  title: Joi.string().required(),
  content: Joi.string().required(),
});
