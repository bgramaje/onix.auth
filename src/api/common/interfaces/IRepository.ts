import { Filter, FindOptions, ObjectId } from 'mongodb';
import { HttpMessage } from '../models/HttpMessage';

type dbId = string | ObjectId;

/**
 * @interface IRepository
 * @extends IDbModel base interface model of all data models
 */
export declare interface IRepository<T> {
    post(entity: Partial<T>): Promise<Partial<HttpMessage<T>>>;
    put(id: dbId, body: Partial<T>): Promise<Partial<HttpMessage<T>>>;
    get(query:  Partial<Filter<T>>, opts?: FindOptions): Promise<T[]>;
    getById(id:dbId, opts?: FindOptions): Promise<T | null>;
}
