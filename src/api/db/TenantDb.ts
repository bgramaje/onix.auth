import bcrypt from 'bcrypt';
import {
  Filter,
  WithoutId,
} from 'mongodb';

import { BaseDb, BaseDbInterface } from './BaseDb';
import { logger } from '../../config/logger';

import { HttpMessage } from '../models/HttpMessage';
import { TenantModel } from '../models/TenantModel';

export class TenantDb extends BaseDb<TenantModel> {
  async post(entity: TenantModel): Promise<HttpMessage> {
    await this.collection.insertOne(entity);
    return {
      status: 200,
      msg: 'Successfully inserted new tenant',
    };
  }

  async put(id: string, body: any): Promise<HttpMessage> {
    await this.collection.updateOne({ _id: id }, body);
    return {
      status: 200,
      msg: 'Successfully updated tenant',
    };
  }
}
