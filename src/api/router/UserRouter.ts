import { Router } from 'express';
import {
  Document, Filter, WithId, WithoutId,
} from 'mongodb';
import expressAsyncHandler from 'express-async-handler';
import { BaseCtrl } from '../controller/BaseController';
import { HttpMessage } from '../models/HttpMessage';
import { BaseRouter } from './BaseRouter';
import { UserModel } from '../models/UserModel';
import { UserController } from '../controller/UserController';

export interface BaseRouterInterface<T extends Document> {
    controller: BaseCtrl<T>,
}

export abstract class UserRouter extends BaseRouter<UserModel> {
  constructor(controller: UserController) {
    super(controller);
    this.router.post('/', expressAsyncHandler(this.controller.post));
    this.router.put('/:id', expressAsyncHandler(this.controller.put));
  }
}
