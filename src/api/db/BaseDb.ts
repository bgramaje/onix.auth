/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Collection,
  Db,
  Document,
  Filter,
  WithId,
  WithoutId,
} from 'mongodb';
import { HttpMessage } from '../models/HttpMessage';

export interface BaseDbInterface<T extends Document> {
  collection: Collection<T>,
  get(query?: Filter<T>): Promise<WithId<T>[] | []>,
  getById(id: Filter<T>): Promise<WithId<T> | null>,
}

export abstract class BaseDb<T extends Document> implements BaseDbInterface<T> {
  private static instances: { [key: string]: BaseDbInterface<any> } = {};

  collection: Collection<T>;

  public constructor(db: Db, collectionName: string) {
    this.collection = db.collection<T>(collectionName);
  }

  public static getInstance<C extends BaseDb<any>>(
    Ctor: new (...args: any[]) => C,
    ...args: any[]
  ): C {
    if (!BaseDb.instances[Ctor.name]) {
      BaseDb.instances[Ctor.name] = new Ctor(...args);
    }

    return BaseDb.instances[Ctor.name] as C;
  }

  get = async (query?: Filter<T>): Promise<WithId<T>[]> => {
    const entities = await this.collection.find(query ?? {}).toArray();
    return entities;
  };

  getById = async (id: Filter<T>): Promise<WithId<T> | null> => {
    const entity = await this.collection.findOne({ _id: id });
    return entity;
  };

  abstract post(entity: T): Promise<HttpMessage>;

  abstract put(id: Filter<T>, body: WithoutId<T>): Promise<HttpMessage>;
}
