import {
  Filter, WithoutId, Db,
} from 'mongodb';

import { NextFunction, Request, Response } from 'express';

import { UserDb } from '../db/UserDb';
import { UserModel } from '../models/UserModel';
import { BaseCtrl } from './BaseController';
import { BaseDb } from '../db/BaseDb';

export class UserController extends BaseCtrl<UserModel, UserDb> {
  constructor(db: Db) {
    const repository: UserDb = BaseDb.getInstance<UserDb>(UserDb, db, 'users');
    super(repository);
  }

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query = null } = req;
      const entities = await this.repository.get(query as Filter<UserModel> ?? {});
      res.status(200).json(entities);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { params = {} } = req;
      const { id = null } = params;

      if (!id) {
        res.status(500).json({
          status: 500,
          msg: 'Missing \'id\' field',
        });
        return;
      }

      const entity = await this.repository.getById(id as unknown as Filter<UserModel> ?? {});
      res.status(200).json(entity);
    } catch (error) {
      next(error);
    }
  };

  post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { body = {} } = req;
      console.log(body);

      const data = await this.repository.post(body as UserModel ?? {});
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  put = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { params = {}, body = {} } = req;
      const { id = null } = params;
      if (!id) {
        res.status(404).json({
          msg: 'Missing \'id\' field',
        });
        return;
      }
      const data = await this.repository.put(id as unknown as WithoutId<UserModel>, body);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}
