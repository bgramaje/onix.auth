/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Document,
  Db,
} from 'mongodb';

import { NextFunction, Request, Response } from 'express';
import { BaseDb } from '../db/BaseDb';

export interface BaseCtrlInterface<U> {
  repository: U
}

export abstract class BaseCtrl<T extends Document, U extends BaseDb<T>> implements BaseCtrlInterface<U> {
  private static instances: { [key: string]: BaseCtrlInterface<any> } = {};

  repository: U;

  public constructor(repository: U) {
    this.repository = repository;
  }

  public static getInstance<C extends BaseCtrl<any, any>>(
    ...args: any[]
  ): C {
    const key = this.name;
    if (!this.instances[key]) {
      this.instances[key] = new (this as any)(...args);
    }
    return this.instances[key] as C;
  }

  abstract get(req: Request, res: Response, next: NextFunction): Promise<void>;

  abstract getById(req: Request, res: Response, next: NextFunction): Promise<void>;

  abstract post(req: Request, res: Response, next: NextFunction): Promise<void>;

  abstract put(ireq: Request, res: Response, next: NextFunction): Promise<void>;
}
