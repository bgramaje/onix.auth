import { Router } from 'express';
import {
  Document,
} from 'mongodb';

import expressAsyncHandler from 'express-async-handler';
import { BaseCtrl } from '../controller/BaseController';

export interface BaseRouterInterface<T extends Document> {
    controller: BaseCtrl<T>,
}

export abstract class BaseRouter<T extends Document = Document> implements BaseRouterInterface<T> {
  controller: BaseCtrl<T>;

  router: Router = Router();

  constructor(controller: BaseCtrl<T>) {
    this.controller = controller;
    this.router.get('/', expressAsyncHandler(this.controller.get));
    this.router.get('/:id', expressAsyncHandler(this.controller.getById));
  }
}
