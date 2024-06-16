import { IDbModel } from '../interfaces/IDbModel';

export interface TenantModel extends IDbModel {
    name: string,
    license: string,
    licenseExpirationDate: Date;
    users: number;
    activeUsers: Array<string>
}
