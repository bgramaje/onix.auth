import {
  Filter, Db,
  MongoClient,
} from 'mongodb';

import { NextFunction, Request, Response } from 'express';

import { UserModel } from '../models/UserModel.ts';

import { COLLECTIONS } from '../../config/collections.ts';
import { TenantModel } from '../models/TenantModel.ts';
import { LicenseModel } from '../models/LicenseModel.ts';
import { Controller } from './Controller.ts';
import { Repository } from '../repository/Repository.ts';

export class UserController extends Controller<UserModel> {
  constructor(db: Db) {
    const repository: Repository<UserModel> = Repository.getInstance(COLLECTIONS.USERS, db);
    super(repository);
  }

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query = {} } = req;
      const entities = await this.repository.get(query as Filter<UserModel>);
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

      const entity = await this.repository.getById(id);
      res.status(200).json(entity);
    } catch (error) {
      next(error);
    }
  };

  post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { body, db, client }: { body: UserModel, db: Db, client: MongoClient} = req;
    const session = client.startSession();

    try {
      const { tenant = null, _id: id } = body;
      // check if user already exists
      const existsUser: UserModel | null = await this.repository.getById(id);
      if (existsUser) throw new Error(`User with id: ${id} already exists`);

      // check if given tenant exists
      const tenantDb: Repository<TenantModel & { license: LicenseModel }> = Repository
        .getInstance(COLLECTIONS.TENANTS, db);

      const tenantEnt:
       TenantModel & {license: LicenseModel} | null = await tenantDb
         .getById(tenant as string);

      // if no tenant exists or no tenant provided then throw error
      if (!tenant || !tenantEnt) {
        throw new Error(
          tenant
            ? `Tenant with id: '${tenant}' not found.`
            : 'Missing \'tenant\' field',
        );
      }

      // check license over tenant
      if (tenantEnt) {
        const { license = null } = tenantEnt;
        if (!license) throw new Error(`Provided tenant '${tenant} has no license associated'`);
        if (license.limitUsers + 1 > tenantEnt.users) {
          throw new Error(`${tenant} reached the max amount allowed by your license, please upgrade it.`);
        }
      }

      // start of transaction
      session.startTransaction();
      const data = await this.repository.post(body);
      // increase in one the amount of users created into the database
      await tenantDb.put(tenant, { $inc: { users: 1 } });
      await session.commitTransaction();
      // end of transaction
      res.status(200).json(data);
    } catch (error) {
      if (session.inTransaction()) session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
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
