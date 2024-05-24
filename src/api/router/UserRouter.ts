import { Router } from 'express';
import {
  Db,
} from 'mongodb';
import expressAsyncHandler from 'express-async-handler';

import { BaseCtrl } from '../controller/BaseController';
import { UserController } from '../controller/UserController';

export class UserRouter {
  router: Router;

  constructor(db: Db, collection: string) {
    this.router = Router();

    const controller: UserController = UserController.getInstance(db, collection);

    this.router.get('/', expressAsyncHandler(controller.get));
    this.router.get('/:id', expressAsyncHandler(controller.getById));
    this.router.post('/', expressAsyncHandler(controller.post));
    this.router.put('/:id', expressAsyncHandler(controller.put));
  }
}
