import {
  Collection, Db, Filter, OptionalUnlessRequiredId,
} from 'mongodb';

import { HttpMessage } from '../models/HttpMessage';
import { IRepository } from '../interfaces/IRepository';
import { IDbModel } from '../interfaces/IDbModel';
import { HttpStatusCode } from '../../enums/HttpStatusCode';

export class Repository<T extends IDbModel> implements IRepository<T> {
  public static instances: Map<string, object> = new Map();

  collectionName: string;

  collection: Collection<T>;

  constructor(collectionName: string, db: Db) {
    this.collectionName = collectionName;
    this.collection = db.collection<T>(collectionName);
  }

  static getInstance<U extends IDbModel>(
    collectionName: string,
    db: Db,
  ): Repository<U> {
    let instance: object | undefined = this.instances.get(collectionName);
    if (!instance) {
      instance = new this(collectionName, db) as Repository<U>;
      this.instances.set(collectionName, instance);
    }
    return instance as Repository<U>;
  }

  post = async (entity: T): Promise<Partial<HttpMessage>> => {
    const { _id = null } = entity;
    if (!_id) throw new Error('[error] missing \'_id\' field');
    await this.collection.insertOne(entity as OptionalUnlessRequiredId<T>);
    return {
      status: HttpStatusCode.CREATED,
      msg: 'Successfully inserted new entity',
    };
  };

  put = async (id: string, query: object): Promise<Partial<HttpMessage>> => {
    const filter : Filter<T> = { _id: id } as Filter<T>;
    await this.collection.updateOne(filter, query);
    return { status: HttpStatusCode.OK };
  };

  get = async (query: object, opts?: object): Promise<T[]> => {
    const entities = await this.collection.find(query, opts).toArray() as T[];
    return entities;
  };

  getById = async (id: string, opts?: object): Promise<T | null> => {
    const filter : Filter<T> = { _id: id } as Filter<T>;
    const entity = await this.collection.findOne(filter, opts) as T | null;
    return entity;
  };
}
