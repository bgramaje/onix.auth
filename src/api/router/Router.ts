import { Router as ExpressRouter } from 'express';
import { IController } from '../interfaces/IController';

export abstract class Router {
  router : ExpressRouter;

  constructor(controller: IController) {
    this.router = ExpressRouter();
    this.init(controller);
  }

  abstract init(controller: IController): void;

  get = (): ExpressRouter => this.router;
}
