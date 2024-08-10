import { Db } from 'mongodb';
import expressAsyncHandler from 'express-async-handler';
import { Router } from '../../common/classes/Router';
import { TenantController } from '../controllers/TenantController';

export class TenantRouter extends Router<TenantController> {
  constructor(db: Db) {
    const controller = new TenantController(db);
    super(controller);
  }

  init(controller: TenantController): void {
    /** authentication middleware for decoding token */
    // this.router.all('*', authMiddleware);
    /** check if user decoded from token is super */
    // this.router.all('*', isSuperMiddlware);
    /** licenses endpoints */
    this.router.get('/', expressAsyncHandler(controller.get));
    this.router.get('/:id', expressAsyncHandler(controller.getById));
    this.router.post('/', expressAsyncHandler(controller.post));
    this.router.put('/:id', expressAsyncHandler(controller.put));
  }
}
