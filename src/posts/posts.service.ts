import { Response, Request, NextFunction } from 'express';
import { createError } from '../core/utils/helpers/error';
import { CreatePostDTO, UpdatePostDTO } from './posts.dto';
import { IPost, Post } from './posts.model';

const populateOptions = {
  // path: 'user_id',
  // select: '-password -refresh_token',
};

export class PostService {
  async delete(id: string) {
    const post = await Post.findOneAndRemove({ _id: id }).lean();
    if (!post) throw createError(404, 'Post not found');
    return post;
  }
  async create(user_id: string, createPostDTO: CreatePostDTO) {
    const newPost = new Post({
      user_id,
      ...createPostDTO,
    });
    const savedPost = await newPost.save();
    const populatedPost = await savedPost;

    return populatedPost;
  }

  async getById(id: string) {
    const post = await Post.findOne({ _id: id }).lean();
    if (!post) throw createError(404, 'Post not found');
    return post;
  }

  async getByUser(id: string): Promise<IPost[]> {
    const posts = await Post.find({ user_id: id }).lean();
    return posts;
  }

  async getAll() {
    const post = await Post.find({}).lean();
    return post;
  }

  async update(updatePostDTO: UpdatePostDTO, id: string) {
    const post = await Post.findOneAndReplace({ _id: id }, updatePostDTO, { new: true }).lean();
    if (!post) throw createError(404, 'Post not found');
    return post;
  }
}
