import { Router as ExpressRouter } from 'express';
import { IRouter } from '../interfaces/IRouter';
import { Controller } from './Controller';

export abstract class Router<T extends Controller<unknown>> implements IRouter {
  router : ExpressRouter;

  constructor(controller: T) {
    this.router = ExpressRouter();
    this.init(controller);
  }

  abstract init(controller: T): void;

  get = (): ExpressRouter => this.router;
}
