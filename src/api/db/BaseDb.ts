/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Collection,
  Db,
  Document,
  WithId,
} from 'mongodb';
import { HttpMessage } from '../models/HttpMessage.ts';

export interface BaseDbInterface<T extends Document> {
  collection: Collection<T>,
  get(query?: any): Promise<WithId<T>[] | []>,
  getById(id: any): Promise<WithId<T> | null>,
  post(entity: T): Promise<HttpMessage>;
  put(id: string, body: any): Promise<HttpMessage>;
}

export abstract class BaseDb<T extends Document> {
  private static instances: { [key: string]: BaseDbInterface<any> } = {};

  collection: Collection<T>;

  public constructor(db: Db, collectionName: string) {
    this.collection = db.collection<T>(collectionName);
  }

  public static getInstance<C extends BaseDb<any>>(
    ...args: any[]
  ): C {
    const key = this.name;
    if (!this.instances[key]) {
      this.instances[key] = new (this as any)(...args);
    }
    return this.instances[key] as C;
  }

  get = async (query?: any): Promise<WithId<T>[]> => {
    const entities = await this.collection.find(query ?? {}).toArray();
    return entities;
  };

  getById = async (id: any): Promise<WithId<T> | null> => {
    const entity = await this.collection.findOne({ _id: id });
    return entity;
  };

  abstract post(entity: T): Promise<HttpMessage>;

  abstract put(id: string, body: any): Promise<HttpMessage>;
}
