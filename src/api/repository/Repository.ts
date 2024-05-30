import {
  Collection, Db, Filter, OptionalUnlessRequiredId,
} from 'mongodb';
import { HttpMessage } from '../models/HttpMessage';
import { DbModel, IRepository } from '../interfaces/IRepository';

export type Constructor<T> = new (...args: unknown[]) => T;

export class Repository<T extends DbModel> implements IRepository<T> {
  public static instances: Map<string, object> = new Map();

  collectionName: string;

  collection: Collection<T>;

  constructor(db: Db, collectionName: string) {
    this.collectionName = collectionName;
    this.collection = db.collection<T>(collectionName);
  }

  static getInstance<X extends DbModel, U extends IRepository<X>>(
    collectionName: string,
    ...args: unknown[]
  ): U {
    const instance = this.instances.get(collectionName);
    if (!instance) {
      this.instances.set(
        collectionName,
        new (this as unknown as Constructor<U>)(...args),
      );
    }
    return instance as U;
  }

  post = async (entity: T): Promise<Partial<HttpMessage>> => {
    const { _id = null } = entity;
    if (!_id) throw new Error('[error] missing \'_id\' field');
    await this.collection.insertOne(entity as OptionalUnlessRequiredId<T>);
    return {
      status: 200,
      msg: 'Successfully inserted new entity',
    };
  };

  put = async (id: string, query: object): Promise<Partial<HttpMessage>> => {
    const filter : Filter<T> = { _id: id } as Filter<T>;
    await this.collection.updateOne(filter, query);
    return { status: 200 };
  };

  get = async (query: object): Promise<T[]> => {
    const entities: T[] = await this.collection.find(query).toArray() as T[];
    return entities;
  };

  getById = async (id: string): Promise<T | null> => {
    const filter : Filter<T> = { _id: id } as Filter<T>;
    const entity: T | null = await this.collection.findOne(filter) as T | null;
    return entity;
  };
}
