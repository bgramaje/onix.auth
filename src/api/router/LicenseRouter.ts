import {
  Db,
} from 'mongodb';
import expressAsyncHandler from 'express-async-handler';

import { Router } from './Router.ts';
import { LicenseController } from '../controller/LicenseController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';
import { isSuperMiddlware } from '../middleware/roleMiddleware.ts';

export class LicenseRouter extends Router {
  constructor(db: Db) {
    const controller = new LicenseController(db);
    super(controller);
  }

  init(controller: LicenseController): void {
    /** authentication middleware for decoding token */
    this.router.all('*', authMiddleware);
    /** check if user decoded from token is super */
    this.router.all('*', isSuperMiddlware);
    /** licenses endpoints */
    this.router.get('/', authMiddleware, expressAsyncHandler(controller.get));
    this.router.get('/:id', expressAsyncHandler(controller.getById));
    this.router.post('/', expressAsyncHandler(controller.post));
    this.router.put('/:id', expressAsyncHandler(controller.put));
  }
}
