import {
  Filter, Db,
  FindOptions,
} from 'mongodb';

import { NextFunction, Request, Response } from 'express';

import { TenantModel } from '../models/TenantModel.ts';
import { Controller } from '../../common/classes/Controller.ts';
import { COLLECTIONS } from '../../../config/collections.ts';
import { HttpStatusCode } from '../../../enums/HttpStatusCode.ts';
import { TenantRepository } from '../repository/TenantRepository.ts';
import { parseArgs } from '../../../utils/utils.ts';


export class TenantController extends Controller<TenantRepository> {
  constructor(db: Db) {
    const repository = TenantRepository.getInstance<TenantRepository>(COLLECTIONS.TENANTS, db);
    super(repository);
  }

  /**
   * @method GET
   * @function get
   * @description it returns all users from collection.
   * @param req Request from express
   * @param res Response from express
   * @param next NextFunction from expres
   */
  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query = {} } = req;
      let { filter = '{}', opts = '{}' } = query;

      filter = parseArgs(filter as string, res)
      opts = parseArgs(opts as string, res);
      
      const entities = await this.repository.get(filter as Filter<TenantModel>, opts as FindOptions);
      res.status(HttpStatusCode.OK).json(entities);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { params = {}, query = {} } = req;
      const { id = null } = params;
      let { opts = '{}' } = query;

      if (!id) {
        res.status(HttpStatusCode.BAD_REQUEST);
        throw new Error('Missing \'id\' parameter')
      }
      
      opts = parseArgs(opts as string, res);

      const entity = await this.repository.getById(id as string, opts as FindOptions);
      res.status(HttpStatusCode.OK).json(entity);
    } catch (error) {
      next(error);
    }
  };

  post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { body = {} } = req;
      const data = await this.repository.post(body);
      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  put = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { params = {}, body = {} } = req;
      const { id = null } = params;
      if (!id) {
        res.status(HttpStatusCode.BAD_REQUEST);
        throw new Error('Missing \'id\' field')
      }
      const data = await this.repository.put(id, body);
      res.status(HttpStatusCode.OK).json(data);
    } catch (error) {
      next(error);
    }
  };
}
