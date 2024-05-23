import bcrypt from 'bcrypt';
import {
  Filter,
  WithoutId,
} from 'mongodb';

import { BaseDb, BaseDbInterface } from './BaseDb';
import { logger } from '../../config/logger';

import { HttpMessage } from '../models/HttpMessage';
import { TenantModel } from '../models/TenantModel';

export interface TenantDbInterface extends BaseDbInterface<TenantModel> {
    post(entity: TenantModel): Promise<HttpMessage>,
    put(id: Filter<TenantModel>, body:WithoutId<TenantModel>): Promise<HttpMessage>,
}

export class TenantDb extends BaseDb<TenantModel> implements TenantDbInterface {
  async post(entity: TenantModel): Promise<HttpMessage> {
    try {
      await this.collection.insertOne(entity);
      return {
        status: 200,
        msg: 'Successfully inserted new tenant',
      };
    } catch (error: unknown) {
      logger.error(error);
      return {
        status: 400,
        msg: new Error(error as string).message,
        stack: new Error(error as string).stack,
      };
    }
  }

  async put(id: Filter<TenantModel>, body: WithoutId<TenantModel>): Promise<HttpMessage> {
    try {
      await this.collection.updateOne({ _id: id }, { $set: { body } });
      return {
        status: 200,
        msg: 'Successfully updated tenant',
      };
    } catch (error) {
      logger.error(error);
      return {
        status: 400,
        msg: new Error(error as string).message,
        stack: new Error(error as string).stack,
      };
    }
  }
}
