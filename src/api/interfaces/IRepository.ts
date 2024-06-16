import { HttpMessage } from '../models/HttpMessage';
import { UserModel } from '../models/UserModel';
import { AuthModel } from '../models/AuthModel';
import { TenantModel } from '../models/TenantModel';
import { LicenseModel } from '../models/LicenseModel';
import { IDbModel } from './IDbModel';

export type DbModel = | UserModel | AuthModel | TenantModel | LicenseModel

export declare interface IRepository<T extends IDbModel> {
    post(entity: T): Promise<Partial<HttpMessage>>;
    put(id: string, body: Partial<T>): Promise<Partial<HttpMessage>>;
    get(query: object, opts?: object): Promise<T[]>;
    getById(id: string, opts?: object): Promise<T | null>;
}
