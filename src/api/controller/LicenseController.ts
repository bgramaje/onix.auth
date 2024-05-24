import {
  Filter, WithoutId, Db,
} from 'mongodb';

import { NextFunction, Request, Response } from 'express';

import { BaseCtrl } from './BaseController';
import { BaseDb } from '../db/BaseDb';
import { LicenseModel } from '../models/LicenseModel';
import { LicenseDb } from '../db/LicenseDb';

export class LicenseController extends BaseCtrl<LicenseModel, LicenseDb> {
  constructor(db: Db, collectionName: string) {
    const repository: LicenseDb = BaseDb.getInstance<LicenseDb>(LicenseDb, db, collectionName);
    super(repository);
  }

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query = null } = req;
      const entities = await this.repository.get(query as Filter<LicenseModel> ?? {});
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

      const entity = await this.repository.getById(id as unknown as Filter<LicenseModel> ?? {});
      res.status(200).json(entity);
    } catch (error) {
      next(error);
    }
  };

  post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { body = {} } = req;
      const data = await this.repository.post(body as LicenseModel ?? {});
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
      const data = await this.repository.put(id, body);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}
