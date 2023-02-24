import express from 'express';
import { auth } from '../core/utils/middleware/auth.middleware';
import { Roles } from '../core/utils/types/enum';
import { PostController } from './post.controller';

const PostRouter = express.Router();
const postController = new PostController();

PostRouter.get('', postController.getAll);
PostRouter.post('/', auth(Roles.CUSTOMER), postController.create);
PostRouter.get('/:id/users', auth(Roles.CUSTOMER), postController.getByUser);
PostRouter.get('/:id', auth(Roles.CUSTOMER), postController.getById);
PostRouter.put('/:id', auth(Roles.CUSTOMER), postController.update);
PostRouter.delete('/:id', auth(Roles.CUSTOMER), postController.delete);

export { PostRouter };
