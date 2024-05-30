import { Router } from 'express';

import expressAsyncHandler from 'express-async-handler';

import { Db } from 'mongodb';
import { AuthController } from '../controller/AuthController.ts';

export class AuthRouter {
  router: Router;

  constructor(db: Db) {
    this.router = Router();

    const controller = new AuthController(db);
    this.router.post('/login', expressAsyncHandler(controller.login));
  }

  get = (): Router => this.router;
}
