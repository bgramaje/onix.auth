import { Db } from 'mongodb';
import { Repository } from '../../common/classes/Repository';
import { LicenseModel } from '../models/LicenseModel';

export class LicenseRepository extends Repository<LicenseModel> {
  constructor(collectionName: string, db: Db) {
    super(collectionName, db)
  }
}
