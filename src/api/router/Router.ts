import { Router as ExpressRouter } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { IController } from '../interfaces/IController';
import { authMiddleware } from '../middleware/authMiddleware';

export class Router {
  router;

  constructor(controller: IController) {
    this.router = ExpressRouter();
    this.router.get('/', [authMiddleware], expressAsyncHandler(controller.get));
    this.router.get('/:id', expressAsyncHandler(controller.getById));
    this.router.post('/', expressAsyncHandler(controller.post));
    this.router.put('/:id', expressAsyncHandler(controller.put));
  }

  get = (): ExpressRouter => this.router;
}
