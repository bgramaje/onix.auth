import { Request, Response, NextFunction } from 'express';

import { IController } from '../interfaces/IController';
import { DbModel, IRepository } from '../interfaces/IRepository';

export abstract class Controller<T extends DbModel> implements IController {
  repository: IRepository<T>;

  constructor(repository: IRepository<T>) {
    this.repository = repository;
  }

  abstract get(req: Request, res: Response, next: NextFunction): Promise<void>;

  abstract getById(req: Request, res: Response, next: NextFunction): Promise<void>;

  abstract post(req: Request, res: Response, next: NextFunction): Promise<void>;

  abstract put(ireq: Request, res: Response, next: NextFunction): Promise<void>;
}
