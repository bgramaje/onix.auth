import {
  Collection, Db, Filter, FindOptions, OptionalUnlessRequiredId,
} from 'mongodb';

import { HttpMessage } from '../models/HttpMessage';
import { IRepository } from '../interfaces/IRepository';
import { HttpStatusCode } from '../models/HttpStatusCode';

export class Repository<T> implements IRepository<T> {
  public static instances: Map<string, Repository<any>> = new Map();

  collectionName: string;

  collection: Collection<any>;

  constructor(collectionName: string, db: Db) {
    this.collectionName = collectionName;
    this.collection = db.collection<any>(collectionName);
  }

  // Static method to get the singleton instance of Repository for a specific collection
  public static getInstance<T>(
    collectionName: string,
    db: Db,
  ): T {
    let instance = this.instances.get(collectionName);

    // if no instance exists, create one and store it in the map
    if (!instance) {
      instance = new this(collectionName, db);
      this.instances.set(collectionName, instance);
    }

    return instance as T;
  }

  post = async (entity: T): Promise<Partial<HttpMessage<T>>> => {
    await this.collection.insertOne(entity as OptionalUnlessRequiredId<T>);
    return {
      status: HttpStatusCode.CREATED,
      msg: 'Successfully inserted new entity',
    };
  };

  put = async (id: string, query: object): Promise<Partial<HttpMessage<T>>> => {
    const filter: Filter<T> = { _id: id } as Filter<T>;
    await this.collection.updateOne(filter, query);
    return { status: HttpStatusCode.OK };
  };

  get = async (query: Partial<Filter<T>>, opts?: FindOptions): Promise<T[]> => {
    const entities = await this.collection.find(query, opts).toArray() as T[];
    return entities;
  };

  getById = async (id: string, opts?: object): Promise<T | null> => {
    const filter = { _id: id } as Filter<T>;
    const entity = await this.collection.findOne(filter, opts) as T | null;
    return entity;
  };
}
