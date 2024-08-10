import {
  Db,
} from 'mongodb';
import expressAsyncHandler from 'express-async-handler';
import { Router } from '../../common/classes/Router';
import { AuthController } from '../controllers/AuthController';

export class AuthRouter extends Router<AuthController> {
  constructor(db: Db) {
    const controller = new AuthController(db);
    super(controller);
  }

  init(controller: AuthController): void {
    /** authentication middleware for decoding token */
    // this.router.all('*', authMiddleware);
    /** check if user decoded from token is super */
    // this.router.all('*', isSuperMiddlware);
    /** licenses endpoints */
    this.router.post('/login', expressAsyncHandler(controller.login));

  }
}
