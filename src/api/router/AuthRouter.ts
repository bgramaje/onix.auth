import expressAsyncHandler from 'express-async-handler';

import { Db } from 'mongodb';
import { AuthController } from '../controller/AuthController.ts';
import { Router } from './Router.ts';

export class AuthRouter extends Router {
  constructor(db: Db) {
    const controller: AuthController = new AuthController(db);
    super(controller);
  }

  init(controller: AuthController): void {
    this.router.post('/login', expressAsyncHandler(controller.login));
  }
}
