import {
  Db,
} from 'mongodb';

import expressAsyncHandler from 'express-async-handler';
import { UserController } from '../controller/UserController.ts';
import { Router } from './Router.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { isAdminMiddleware } from '../middleware/roleMiddleware.ts';

export class UserRouter extends Router {
  constructor(db: Db) {
    const controller = new UserController(db);
    super(controller);
  }

  init(controller: UserController): void {
    /** authentication middleware for decoding token */
    this.router.all('*', authMiddleware);
    /** check if user decoded from token is at least admin */
    this.router.all('*', isAdminMiddleware);
    /** user endpoints */
    this.router.get('/', expressAsyncHandler(controller.get));
    this.router.get('/:id', expressAsyncHandler(controller.getById));
    this.router.post('/', expressAsyncHandler(controller.post));
    this.router.put('/:id', expressAsyncHandler(controller.put));
  }
}
