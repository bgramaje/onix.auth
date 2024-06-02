import {
  Db,
} from 'mongodb';

import expressAsyncHandler from 'express-async-handler';
import { Router } from './Router.ts';
import { TenantController } from '../controller/TenantController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { isSuperMiddlware } from '../middleware/roleMiddleware.ts';

export class TenantRouter extends Router {
  constructor(db: Db) {
    const controller = new TenantController(db);
    super(controller);
  }

  init(controller: TenantController): void {
    /** authentication middleware for decoding token */
    this.router.all('*', authMiddleware);
    /** check if user decoded from token is super */
    this.router.all('*', isSuperMiddlware);
    /** tenant endpoints */
    this.router.get('/', expressAsyncHandler(controller.get));
    this.router.get('/:id', expressAsyncHandler(controller.getById));
    this.router.post('/', expressAsyncHandler(controller.post));
    this.router.put('/:id', expressAsyncHandler(controller.put));
  }
}
