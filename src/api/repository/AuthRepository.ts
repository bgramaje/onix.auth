
import { Db } from 'mongodb';
import { Repository } from './Repository';
import { AuthModel } from '../models/AuthModel';

export class AuthRepository extends Repository<AuthModel> {
  constructor(collectionName: string, db: Db) {
    super(collectionName, db);
    this.collection.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
  }
}
