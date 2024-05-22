import { Router } from 'express';
import {
  Db,
} from 'mongodb';
import expressAsyncHandler from 'express-async-handler';

import { BaseCtrl } from '../controller/BaseController';
import { UserModel } from '../models/UserModel';
import { UserController } from '../controller/UserController';
import { UserDb } from '../db/UserDb';

export class UserRouter {
  router: Router;

  constructor(db: Db) {
    this.router = Router();

    const controller: UserController = BaseCtrl
      .getInstance<UserController>(UserController, db);

    this.router.get('/', expressAsyncHandler(controller.get));
    this.router.get('/:id', expressAsyncHandler(controller.getById));
    this.router.post('/', expressAsyncHandler(controller.post));
    this.router.put('/:id', expressAsyncHandler(controller.put));
  }
}
