import { Request, Response, NextFunction } from 'express';

import { IController } from '../interfaces/IController';

export abstract class Controller<T> implements IController {
  repository: T;

  constructor(repository: T) {
    this.repository = repository;
  }

  abstract get(req: Request, res: Response, next: NextFunction): Promise<void>;

  abstract getById(req: Request, res: Response, next: NextFunction): Promise<void>;

  abstract post(req: Request, res: Response, next: NextFunction): Promise<void>;

  abstract put(ireq: Request, res: Response, next: NextFunction): Promise<void>;
}
