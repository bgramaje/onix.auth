import {
  Filter, WithId, WithoutId, Document,
  Db,
} from 'mongodb';
import { NextFunction, Request, Response } from 'express';
import { BaseDb } from '../db/BaseDb';
import { logger } from '../../config/logger';
import { HttpMessage } from '../models/HttpMessage';
import { UserDb } from '../db/UserDb';
import { UserModel } from '../models/UserModel';

export interface BaseCtrlInterface<U> {
  repository: U
}

export abstract class BaseCtrl<T extends Document, U extends BaseDb<T>> implements BaseCtrlInterface<U> {
  private static instances: { [key: string]: BaseCtrlInterface<any> } = {};

  repository: U;

  public constructor(repository: U) {
    this.repository = repository;
  }

  public static getInstance<A extends Document, Z extends BaseDb<A>, C extends BaseCtrl<A, Z>>(
    Ctor: new (...args: any[]) => C,
    controllerName: string,
    db: Db,
  ): C {
    if (!BaseCtrl.instances[controllerName]) {
      BaseCtrl.instances[controllerName] = new Ctor(db);
    }

    return BaseCtrl.instances[controllerName] as C;
  }

  abstract get(req: Request, res: Response, next: NextFunction): Promise<void>;

  abstract getById(req: Request, res: Response, next: NextFunction): Promise<void>;

  abstract post(req: Request, res: Response, next: NextFunction): Promise<void>;

  abstract put(ireq: Request, res: Response, next: NextFunction): Promise<void>;
}
