import { Request, Response, NextFunction } from 'express';
import { createResponse } from '../core/utils/helpers/response';
import { validate } from '../core/utils/helpers/validate';
import { CustomRequest } from '../core/utils/middleware/auth.middleware';
import {
  CreatePostDTO,
  createPostSchema,
  getPostDTO,
  getPostSchema,
  UpdatePostDTO,
  updatePostSchema,
} from './post.dto';
import { PostService } from './post.service';

const postService = new PostService();
export class PostController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = validate<CreatePostDTO>(req.body, createPostSchema);
      const { user } = req as CustomRequest;
      const newPost = await postService.create(user._id, payload);
      createResponse(res, newPost, 'Created new Post', 201);
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = validate<getPostDTO>(req.params, getPostSchema);
      const post = await postService.get(payload);
      createResponse(res, post);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = validate<UpdatePostDTO>(
        { id: req.params.id, ...req.body },
        updatePostSchema,
      );
      const post = await postService.update(payload);
      createResponse(res, post);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = validate<getPostDTO>(req.params, getPostSchema);
      const post = await postService.delete(payload);
      createResponse(res, post);
    } catch (error) {
      next(error);
    }
  }
}
