import {
  Filter, Db,
} from 'mongodb';

import { NextFunction, Request, Response } from 'express';

import { TenantModel } from '../models/TenantModel.ts';
import { COLLECTIONS } from '../../config/collections.ts';
import { LicenseModel } from '../models/LicenseModel.ts';
import { Controller } from './Controller.ts';
import { Repository } from '../repository/Repository.ts';

export class TenantController extends Controller<TenantModel> {
  constructor(db: Db) {
    const repository: Repository<TenantModel> = Repository.getInstance(COLLECTIONS.TENANTS, db);
    super(repository);
  }

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query = null } = req;
      const entities = await this.repository.get(query as Filter<TenantModel> ?? {});
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

      const entity = await this.repository.getById(id as string);
      res.status(200).json(entity);
    } catch (error) {
      next(error);
    }
  };

  post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { body, db }: { body: TenantModel, db: Db} = req;
      const {
        license = null, _id: id,
      } = body;
      // check if tenant already exists
      const exists: TenantModel | null = await this.repository.getById(id);
      if (exists) throw new Error(`Tenant with id: ${id} already exists`);

      if (!license) throw new Error(`License with id: '${license}' not found.`);

      // check if given license exists
      const licenseDb: Repository<LicenseModel> = Repository.getInstance(COLLECTIONS.LICENSES, db);
      const licenseEnt: LicenseModel | null = await licenseDb.getById(license);

      // if no license exists or no license provided then throw error
      if (!licenseEnt) throw new Error(`License with id: '${license}' not found.`);

      const data = await this.repository.post({ ...body, users: 0, activeUsers: [] });
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
