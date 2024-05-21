import {
  Collection, Db, Document, Filter, ObjectId, WithId,
  WithoutId,
} from 'mongodb';

import { logger } from '../../config/logger';
import { HttpMessage } from '../models/HttpMessage';

export interface BaseDbInterface<T extends Document> {
  collection: Collection<T>,
  get(query?: Filter<T>): Promise<WithId<T>[] | []>,
  getById(id: Filter<T>): Promise<WithId<T> | null>,
}

export abstract class BaseDb<T extends Document = Document> implements BaseDbInterface<T> {
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
      const entity = await this.collection.findOne({ _id: id });
      return entity;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  abstract post(entity: T): Promise<HttpMessage>;

  abstract put(id: Filter<T>, body: WithoutId<T>): Promise<HttpMessage>;
}
