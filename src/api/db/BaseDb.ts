import {
  Collection, Db, Document, Filter, ObjectId, WithId,
} from 'mongodb';

import { logger } from '../../config/logger';
import { HttpMessage } from '../models/HttpMessage';

export interface BaseDbInterface<T extends Document> {
  collection: Collection<T>,
  get(query?: Filter<T>): Promise<WithId<T>[] | []>,
  getById(id: Filter<T>): Promise<WithId<T> | null>,
}

export abstract class BaseDb<T extends Document> implements BaseDbInterface<T> {
  collection: Collection<T>;

  constructor(db: Db, collection: string) {
    this.collection = db.collection<T>(collection);
  }

  async get(query?: Filter<T>): Promise<WithId<T>[] | []> {
    try {
      const entities = await this.collection.find(query ?? {}).toArray();
      return entities;
    } catch (error) {
      logger.error(error);
      return [];
    }
  }

  async getById(id: Filter<T>): Promise<WithId<T> | null> {
    try {
      const entities = await this.collection.findOne({ _id: id });
      return entities;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  abstract post(entity: T): Promise<HttpMessage>;

  abstract put(id: Filter<T>, body: Omit<T, '_id'>): Promise<HttpMessage>;
}
