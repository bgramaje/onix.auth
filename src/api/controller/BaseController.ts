import {
  Filter, WithId, WithoutId, Document,
} from 'mongodb';
import { NextFunction, Request, Response } from 'express';
import { BaseDb } from '../db/BaseDb';
import { logger } from '../../config/logger';
import { HttpMessage } from '../models/HttpMessage';

export interface BaseCtrlInterface<T extends Document> {
    repository: BaseDb<T>,
}

export abstract class BaseCtrl<T extends Document = Document> implements BaseCtrlInterface<T> {
  repository : BaseDb<T>;

  constructor(repository: BaseDb<T>) {
    this.repository = repository;
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { query = null } = req;
    const entities = await this.repository.get(query as Filter<T> ?? {});
    res.status(200).json(entities);
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { params = {} } = req;
    const { id = null } = params;

    if (!id) {
      res.status(404).json({
        msg: 'Missing \'id\' field',
      });
      return;
    }

    const entity = await this.repository.getById(id as unknown as Filter<T> ?? {});
    res.status(200).json(entity);
  }

  abstract post(req: Request, res: Response, next: NextFunction): Promise<void>;

  abstract put(ireq: Request, res: Response, next: NextFunction): Promise<void>;
}
