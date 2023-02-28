import { Request as ExRequest, Response, NextFunction } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa';
import { PostRoutes, Routes } from '../core/utils/constants/api';
import { Roles } from '../core/utils/constants/roles';
import { createResponse, HttpResponse } from '../core/utils/helpers/response';
import { validate } from '../core/utils/helpers/validate';
import { CustomRequest } from '../core/utils/middleware/auth.middleware';
import { CreatePostDTO, createPostSchema, UpdatePostDTO, updatePostSchema } from './posts.dto';
import { IPost } from './posts.model';
import { PostService } from './posts.service';

@Route('posts')
@Tags('Posts')
export class PostController extends Controller {
  @Security('jwt', [Roles.CUSTOMER])
  @Post(PostRoutes.POST_CREATE_POST)
  async create(
    @Request() req: CustomRequest,
    @Body() body: CreatePostDTO,
  ): Promise<HttpResponse<IPost>> {
    const payload = validate<CreatePostDTO>(body, createPostSchema);
    // const { user } = req as CustomRequest;
    const newPost = await new PostService().create(req.user._id, payload);
    return createResponse(this, newPost, 201);
  }

  @Security('jwt', [Roles.CUSTOMER])
  @Get(PostRoutes.GET_BY_ID)
  async getById(@Path() id: string): Promise<HttpResponse<IPost>> {
    const post = await new PostService().getById(id);
    return createResponse(this, post);
  }

  @Security('jwt', [Roles.CUSTOMER])
  @Get(PostRoutes.GET_BY_USER)
  async getByUser(@Path() id: string): Promise<HttpResponse<IPost[]>> {
    const post = await new PostService().getByUser(id);
    return createResponse(this, post);
  }

  @Security('jwt', [Roles.CUSTOMER])
  @Get(PostRoutes.GET_ALL_POSTS)
  async getAll(): Promise<HttpResponse<IPost[]>> {
    const post = await new PostService().getAll();
    return createResponse(this, post);
  }

  @Security('jwt', [Roles.CUSTOMER])
  @Put(PostRoutes.PUT_UPDATE)
  async update(
    @Request() req: CustomRequest,
    @Path() id: string,
    @Body() body: UpdatePostDTO,
  ): Promise<HttpResponse<IPost>> {
    const payload = validate<UpdatePostDTO>(body, updatePostSchema);
    const post = await new PostService().update(payload, id);
    return createResponse(this, post);
  }

  @Security('jwt', [Roles.CUSTOMER])
  @Delete(PostRoutes.DELETE_ID)
  async delete(@Path() id: string): Promise<HttpResponse<IPost>> {
    const post = await new PostService().delete(id);
    return createResponse(this, post);
  }
}
