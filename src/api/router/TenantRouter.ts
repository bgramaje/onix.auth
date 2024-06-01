import {
  Db,
} from 'mongodb';

import expressAsyncHandler from 'express-async-handler';
import { Router } from './Router.ts';
import { TenantController } from '../controller/TenantController.ts';

export class TenantRouter extends Router {
  constructor(db: Db) {
    const controller = new TenantController(db);
    super(controller);
  }

  init(controller: TenantController): void {
    this.router.get('/', expressAsyncHandler(controller.get));
    this.router.get('/:id', expressAsyncHandler(controller.getById));
    this.router.post('/', expressAsyncHandler(controller.post));
    this.router.put('/:id', expressAsyncHandler(controller.put));
  }
}
