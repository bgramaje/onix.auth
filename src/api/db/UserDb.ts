import bcrypt from 'bcrypt';
import {
  Filter,
  WithoutId,
} from 'mongodb';

import { BaseDb, BaseDbInterface } from './BaseDb';
import { logger } from '../../config/logger';
import { UserModel } from '../models/UserModel';
import { HttpMessage } from '../models/HttpMessage';

export class UserDb extends BaseDb<UserModel> {
  async post(user: UserModel): Promise<HttpMessage> {
    const { password = null, username = null } = user ?? {};
    if (!password || !username) throw new Error('Missing required attributes');

    const hashPwd = await bcrypt.hash(password, 10);
    const entity: UserModel = { ...user, password: hashPwd, _id: user?.username };
    await this.collection.insertOne(entity);

    return {
      status: 200,
      msg: 'Successfully inserted new user',
    };
  }

  async put(id: string, body: any): Promise<HttpMessage> {
    await this.collection.updateOne({ _id: id }, { $set: { body } });
    return {
      status: 200,
      msg: 'Successfully updated user',
    };
  }
}
