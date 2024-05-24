import bcrypt from 'bcrypt';
import {
  Filter,
  WithId,
  WithoutId,
} from 'mongodb';

import { BaseDb, BaseDbInterface } from './BaseDb';
import { logger } from '../../config/logger';

import { HttpMessage } from '../models/HttpMessage';
import { TenantModel } from '../models/TenantModel';
import { LicenseModel } from '../models/LicenseModel';
import { COLLECTIONS } from '../../config/collections';

export class TenantDb extends BaseDb<TenantModel> {
  getById = async (id: string): Promise<TenantModel & { license: LicenseModel }| null> => {
    const pipeline = [
      { $match: { _id: id } },
      {
        $lookup: {
          from: COLLECTIONS.LICENSES,
          localField: 'license',
          foreignField: '_id',
          as: 'license',
        },
      },
      { $unwind: '$license' },
    ];

    const entity: TenantModel & { license: LicenseModel } | null = (await this
      .collection
      .aggregate(pipeline)
      .toArray())[0] as TenantModel & { license: LicenseModel } | null;

    return entity;
  };

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
