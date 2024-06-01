import {
  Db,
} from 'mongodb';

import expressAsyncHandler from 'express-async-handler';
import { UserController } from '../controller/UserController.ts';
import { Router } from './Router.ts';

export class UserRouter extends Router {
  constructor(db: Db) {
    const controller = new UserController(db);
    super(controller);
  }

  init(controller: UserController): void {
    this.router.get('/', expressAsyncHandler(controller.get));
    this.router.get('/:id', expressAsyncHandler(controller.getById));
    this.router.post('/', expressAsyncHandler(controller.post));
    this.router.put('/:id', expressAsyncHandler(controller.put));
  }
}
