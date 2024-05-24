import { Router } from 'express';
import {
  Db,
} from 'mongodb';
import expressAsyncHandler from 'express-async-handler';

import { BaseCtrl } from '../controller/BaseController';
import { UserController } from '../controller/UserController';
import { TenantController } from '../controller/TenantController';

export class TenantRouter {
  router: Router;

  constructor(db: Db, collection: string) {
    this.router = Router();

    const controller: TenantController = TenantController.getInstance(db, collection);

    this.router.get('/', expressAsyncHandler(controller.get));
    this.router.get('/:id', expressAsyncHandler(controller.getById));
    this.router.post('/', expressAsyncHandler(controller.post));
    this.router.put('/:id', expressAsyncHandler(controller.put));
  }
}
