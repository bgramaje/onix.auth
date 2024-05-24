import bcrypt from 'bcrypt';
import {
  Filter,
  WithId,
  WithoutId,
} from 'mongodb';

import { BaseDb, BaseDbInterface } from './BaseDb';
import { logger } from '../../config/logger';
import { UserModel } from '../models/UserModel';
import { HttpMessage } from '../models/HttpMessage';
import { LicenseModel } from '../models/LicenseModel';

export class LicenseDb extends BaseDb<LicenseModel> {
  async post(entity: LicenseModel): Promise<HttpMessage> {
    await this.collection.insertOne(entity);
    return {
      status: 200,
      msg: 'Successfully inserted new license',
    };
  }

  async put(id: string, body: any): Promise<HttpMessage> {
    await this.collection.updateOne({ _id: id }, body);
    return {
      status: 200,
      msg: 'Successfully updated license',
    };
  }
}
