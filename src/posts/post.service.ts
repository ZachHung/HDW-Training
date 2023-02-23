import { Response, Request, NextFunction } from 'express';
import { createError } from '../core/utils/helpers/error';
import { User } from '../user/user.model';
import { CreatePostDTO, getPostDTO, UpdatePostDTO } from './post.dto';
import { Post } from './post.model';

export class PostService {
  async delete(payload: getPostDTO) {
    const post = await Post.findOneAndRemove({ _id: payload.id })
      .populate('user_id', '-password -__v')
      .lean();
    if (!post) throw createError(404, 'Post not found');
    return post;
  }
  async create(user_id: string, createPostDTO: CreatePostDTO) {
    const newPost = new Post({
      user_id,
      ...createPostDTO,
    });
    const populatedPost = newPost
      .save()
      .then((data) => data.populate('user_id', '-__v -password'))
      .catch(() => {
        throw createError(500, 'Internal Error');
      });
    return populatedPost;
  }

  async get(getPostDTO: getPostDTO) {
    const post = await Post.findOne({ _id: getPostDTO.id })
      .populate('user_id', '-password -__v')
      .lean();
    if (!post) throw createError(404, 'Post not found');
    return post;
  }

  async update(updatePostDTO: UpdatePostDTO) {
    const { id, ...update } = updatePostDTO;
    const post = await Post.findOneAndUpdate({ _id: id }, update, { new: true })
      .populate('user_id', '-password -__v')
      .lean();
    if (!post) throw createError(404, 'Post not found');
    return post;
  }
}
