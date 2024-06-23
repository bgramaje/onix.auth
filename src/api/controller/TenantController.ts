import {
  Filter, Db,
} from 'mongodb';

import { NextFunction, Request, Response } from 'express';
import isEmpty from 'lodash/isEmpty';

import { DateTime } from 'luxon';
import { AggregatedTenantModel, TenantModel } from '../models/TenantModel.ts';
import { COLLECTIONS } from '../../config/collections.ts';
import { LicenseModel } from '../models/LicenseModel.ts';
import { Controller } from './Controller.ts';
import { Repository } from '../repository/Repository.ts';
import { TenantRepository } from '../repository/TenantRepository.ts';
import { checkArgs, parseArgs } from '../../utils/utils.ts';
import { HttpStatusCode } from '../../enums/HttpStatusCode.ts';

export class TenantController extends Controller<TenantModel> {
  repository: TenantRepository;

  constructor(db: Db) {
    const repository = TenantRepository.getInstance(COLLECTIONS.TENANTS, db) as TenantRepository;
    super(repository);
    this.repository = repository;
  }

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query = {} } = req;
      const { filter = '{}', opts = '{}', aggregate = null } = query;

      if (!isEmpty(aggregate)) {
        const parsedAggregate = parseArgs('aggregate', aggregate as string, res);
        const entities = await this.repository.getAggregated(parsedAggregate) as AggregatedTenantModel[];
        res.status(HttpStatusCode.OK).json(entities);
      } else {
        const parsedOpts = parseArgs('opts', opts as string, res);
        const parsedFilter = parseArgs('filter', filter as string, res);
        const entities = await this.repository.get(parsedFilter as Filter<TenantModel>, parsedOpts) as TenantModel[];
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
        const entity = await this.repository.getByIdAggregated(id as string, parsedAggregate) as AggregatedTenantModel;
        res.status(HttpStatusCode.OK).json(entity);
      } else {
        const parsedOpts = parseArgs('opts', opts as string, res);
        const entity = await this.repository.getById(id as string, parsedOpts) as TenantModel;
        res.status(HttpStatusCode.OK).json(entity);
      }
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

      const data = await this.repository.post({
        ...body,
        users: 0,
        activeUsers: [],
        licenseExpirationDate: (DateTime.now().plus({ days: 1 })).toJSDate(),
      });

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
