import {
  Filter, Db,
  MongoClient,
} from 'mongodb';

import { NextFunction, Request, Response } from 'express';
import isEmpty from 'lodash/isEmpty';

import { AggregatedUserModel, UserModel } from '../models/UserModel.ts';

import { COLLECTIONS } from '../../config/collections.ts';
import { AggregatedTenantModel } from '../models/TenantModel.ts';
import { Controller } from './Controller.ts';
import { Repository } from '../repository/Repository.ts';
import { UserRepository } from '../repository/UserRepository.ts';
import { HttpStatusCode } from '../../enums/HttpStatusCode.ts';
import { checkArgs, parseArgs } from '../../utils/utils.ts';
import { TenantRepository } from '../repository/TenantRepository.ts';

export class UserController extends Controller<UserModel> {
  repository: UserRepository;

  constructor(db: Db) {
    const repository = UserRepository.getInstance(COLLECTIONS.USERS, db) as UserRepository;
    super(repository);
    this.repository = repository;
  }

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query = {} } = req;
      const { filter = '{}', opts = '{}', aggregate = null } = query;

      if (!isEmpty(aggregate)) {
        const parsedAggregate = parseArgs('aggregate', aggregate as string, res);
        const entities = await this.repository.getAggregated(parsedAggregate) as AggregatedUserModel[];
        res.status(HttpStatusCode.OK).json(entities);
      } else {
        const parsedOpts = parseArgs('opts', opts as string, res);
        const parsedFilter = parseArgs('filter', filter as string, res);
        const entities = await this.repository.get(parsedFilter as Filter<UserModel>, parsedOpts) as UserModel[];
        res.status(HttpStatusCode.OK).json(entities);
      }
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { params = {}, query = {} } = req;

      const { id = null } = params;
      const { opts = '{}', aggregate = null } = query;

      checkArgs(['id'], params, res);

      if (!isEmpty(aggregate)) {
        const parsedAggregate = parseArgs('aggregate', aggregate as string, res);
        const entity = await this.repository.getByIdAggregated(id as string, parsedAggregate) as AggregatedUserModel;
        res.status(HttpStatusCode.OK).json(entity);
      } else {
        const parsedOpts = parseArgs('opts', opts as string, res);
        const entity = await this.repository.getById(id as string, parsedOpts) as UserModel;
        res.status(HttpStatusCode.OK).json(entity);
      }
    } catch (error) {
      next(error);
    }
  };

  post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { body, db, client }: { body: UserModel, db: Db, client: MongoClient} = req;
    const session = client.startSession();

    try {
      const { tenant = null, _id: id } = body;
      // check if required args are present inside body
      checkArgs(['_id', 'tenant'], body, res);

      // check if user already exists
      const existsUser: UserModel | null = await this.repository.getById(id);
      // if exists then throw error as no other user can have username duplicity
      if (existsUser) throw new Error(`User with id: ${id} already exists`);

      const tenantAggregation = [
        {
          $lookup: {
            from: 'licenses', localField: 'license', foreignField: '_id', as: 'license',
          },
        },
        {
          $unwind: '$license',
        },
      ];

      // check if given tenant exists
      const tenantDb: TenantRepository = Repository
        .getInstance(COLLECTIONS.TENANTS, db) as TenantRepository;

      const tenantEnt: AggregatedTenantModel | null = await tenantDb
        .getByIdAggregated(tenant as string, tenantAggregation as any[]);

      // if no tenant exists or no tenant provided then throw error
      if (!tenantEnt) throw new Error(`Tenant with id: '${tenant}' not found.`);

      // retrieve license from aggregated tenant
      const { license = null } = tenantEnt;
      if (!license) throw new Error(`Provided tenant '${tenant} has no license associated'`);
      if (tenantEnt.users + 1 > license.limitUsers) {
        throw new Error(`${tenant} reached the max amount allowed, upgrade your license.`);
      }

      // start of transaction
      session.startTransaction();
      const data = await this.repository.post(body);
      // increase in one the amount of users created into the database
      if (tenant) await tenantDb.put(tenant, { $inc: { users: 1 } });
      await session.commitTransaction();
      // end of transaction
      res.status(data.status || HttpStatusCode.CREATED).json(data);
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
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({
            status: HttpStatusCode.BAD_REQUEST,
            msg: 'Missing \'_id\' field',
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
