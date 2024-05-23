import bcrypt from 'bcrypt';
import {
  Filter,
  WithoutId,
} from 'mongodb';

import { BaseDb, BaseDbInterface } from './BaseDb';
import { logger } from '../../config/logger';
import { UserModel } from '../models/UserModel';
import { HttpMessage } from '../models/HttpMessage';
import { LicenseModel } from '../models/LicenseModel';

export interface LicenseDbInterface extends BaseDbInterface<LicenseModel> {
    post(entity: LicenseModel): Promise<HttpMessage>,
    put(id: Filter<LicenseModel>, body:WithoutId<LicenseModel>): Promise<HttpMessage>,
}

export class LicenseDb extends BaseDb<LicenseModel> implements LicenseDbInterface {
  async post(entity: LicenseModel): Promise<HttpMessage> {
    try {
      await this.collection.insertOne(entity);
      return {
        status: 200,
        msg: 'Successfully inserted new user',
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

  async put(id: Filter<LicenseModel>, body: WithoutId<LicenseModel>): Promise<HttpMessage> {
    try {
      await this.collection.updateOne({ _id: id }, { $set: { body } });
      return {
        status: 200,
        msg: 'Successfully updated user',
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
