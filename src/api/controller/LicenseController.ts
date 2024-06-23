import {
  Filter, Db,
} from 'mongodb';

import { NextFunction, Request, Response } from 'express';

import { LicenseModel } from '../models/LicenseModel.ts';
import { Controller } from './Controller.ts';
import { Repository } from '../repository/Repository.ts';
import { COLLECTIONS } from '../../config/collections.ts';
import { HttpStatusCode } from '../../enums/HttpStatusCode.ts';
import { checkArgs, parseArgs } from '../../utils/utils.ts';

export class LicenseController extends Controller<LicenseModel> {
  constructor(db: Db) {
    const repository: Repository<LicenseModel> = Repository.getInstance(COLLECTIONS.LICENSES, db);
    super(repository);
  }

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query = {} } = req;
      const { filter = '{}', opts = '{}' } = query;
      const parsedOpts = parseArgs('opts', opts as string, res);
      const parsedFilter = parseArgs('filter', filter as string, res);
      const entities = await this.repository.get(parsedFilter as Filter<LicenseModel>, parsedOpts) as LicenseModel[];
      res.status(HttpStatusCode.OK).json(entities);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { params = {}, query = {} } = req;

      const { id = null } = params;
      const { opts = '{}' } = query;

      checkArgs(['id'], params, res);

      const parsedOpts = parseArgs('opts', opts as string, res);
      const entity = await this.repository.getById(id as string, parsedOpts) as LicenseModel;
      res.status(HttpStatusCode.OK).json(entity);
    } catch (error) {
      next(error);
    }
  };

  post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { body = {} } = req;

      checkArgs(['name'], body, res);
      const data = await this.repository.post(body);
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
