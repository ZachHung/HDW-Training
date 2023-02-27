import express from 'express';
import { Roles } from '../core/utils/constants/roles';
import { auth } from '../core/utils/middleware/auth.middleware';
import { PostController } from './posts.controller';

const PostRouter = express.Router();

PostRouter.get('', new PostController().getAll);
PostRouter.post('', auth(Roles.CUSTOMER), new PostController().create);
PostRouter.get('/:id/users', auth(Roles.CUSTOMER), new PostController().getByUser);
PostRouter.get('/:id', auth(Roles.CUSTOMER), new PostController().getById);
PostRouter.put('/:id', auth(Roles.CUSTOMER), new PostController().update);
PostRouter.delete('/:id', auth(Roles.CUSTOMER), new PostController().delete);

export { PostRouter };
