import bcrypt from 'bcrypt';
import {
  Filter, ObjectId,
  WithoutId,
} from 'mongodb';

import { BaseDb, BaseDbInterface } from './BaseDb';
import { logger } from '../../config/logger';
import { UserModel } from '../models/UserModel';
import { HttpMessage } from '../models/HttpMessage';

export interface UserDbInterface extends BaseDbInterface<UserModel> {
    post(user: UserModel): Promise<HttpMessage>,
    put(id: Filter<UserModel>, body:WithoutId<UserModel>): Promise<HttpMessage>,
}

export class UserDB extends BaseDb<UserModel> implements UserDbInterface {
  async post(user: UserModel): Promise<HttpMessage> {
    try {
      const { password = null } = user ?? {};
      if (!password) {
        return {
          status: 404,
          msg: 'Missing required password attribute',
        };
      }

      const hashPwd = await bcrypt.hash(password, 10);
      const entity: UserModel = { ...user, password: hashPwd };
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

  async put(id: Filter<UserModel>, body: WithoutId<UserModel>): Promise<HttpMessage> {
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
