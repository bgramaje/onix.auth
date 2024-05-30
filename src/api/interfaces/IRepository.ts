import { HttpMessage } from '../models/HttpMessage';
import { UserModel } from '../models/UserModel';
import { AuthModel } from '../models/AuthModel';
import { TenantModel } from '../models/TenantModel';
import { LicenseModel } from '../models/LicenseModel';

export type DbModel = UserModel | AuthModel | TenantModel | LicenseModel

export declare interface IRepository<T extends DbModel> {
    post(entity: T): Promise<Partial<HttpMessage>>;
    put(id: string, body: Partial<T>): Promise<Partial<HttpMessage>>;
    get(query: object): Promise<T[]>;
    getById(id: string): Promise<T | null>;
}
