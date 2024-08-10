import { Db } from 'mongodb';
import { Repository } from '../../common/classes/Repository';
import { AuthModel } from '../models/AuthModel';

export class AuthRepository extends Repository<AuthModel> {
  constructor(collectionName: string, db: Db) {
    super(collectionName, db)
  }
}
