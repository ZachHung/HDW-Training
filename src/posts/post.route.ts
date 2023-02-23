import express from 'express';
import { auth } from '../core/utils/middleware/auth.middleware';
import { Roles } from '../core/utils/types/enum';
import { PostController } from './post.controller';

const PostRouter = express.Router();
const postController = new PostController();

PostRouter.post('/', auth(Roles.CUSTOMER, Roles.ADMIN), postController.create);
PostRouter.get('/:id', auth(Roles.CUSTOMER, Roles.ADMIN), postController.get);
PostRouter.put('/:id', auth(Roles.CUSTOMER, Roles.ADMIN), postController.update);
PostRouter.delete('/:id', auth(Roles.CUSTOMER, Roles.ADMIN), postController.delete);

export { PostRouter };
