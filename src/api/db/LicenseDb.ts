
import { BaseDb } from './BaseDb.ts';
import { HttpMessage } from '../models/HttpMessage.ts';
import { LicenseModel } from '../models/LicenseModel.ts';

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
