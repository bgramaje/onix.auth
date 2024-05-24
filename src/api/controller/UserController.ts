import {
  Filter, Db,
  MongoClient,
} from 'mongodb';

import { NextFunction, Request, Response } from 'express';

import { UserDb } from '../db/UserDb';
import { UserModel } from '../models/UserModel';
import { BaseCtrl } from './BaseController';
import { TenantDb } from '../db/TenantDb';
import { COLLECTIONS } from '../../config/collections';
import { TenantModel } from '../models/TenantModel';

export class UserController extends BaseCtrl<UserModel, UserDb> {
  constructor(db: Db, collectionName: string) {
    const repository: UserDb = UserDb.getInstance(db, collectionName);
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
    const { body, db, client }: { body: UserModel, db: Db, client: MongoClient} = req;
    const session = client.startSession();

    try {
      const { tenant = null, _id: id } = body;
      // check if user already exists
      const existsUser: UserModel | null = await this.repository.getById(id);
      if (existsUser) throw new Error(`User with id: ${id} already exists`);

      // check if given tenant exists
      const tenantDb: TenantDb = TenantDb.getInstance(db, COLLECTIONS.TENANTS);
      const tenantEnt: TenantModel | null = await tenantDb.getById(tenant);

      // if no tenant exists or no tenant provided then throw error
      if (!tenant || !tenantEnt) {
        throw new Error(
          tenant
            ? `Tenant with id: '${tenant}' not found.`
            : 'Missing \'tenant\' field',
        );
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
