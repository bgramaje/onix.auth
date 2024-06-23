import { IDbModel } from '../interfaces/IDbModel';
import { LicenseModel } from './LicenseModel';

interface BaseTenantModel extends IDbModel {
    name: string,
    licenseExpirationDate: Date;
    users: number;
    activeUsers: Array<string>
}

export interface TenantModel extends BaseTenantModel {
    license: string,
}

export interface AggregatedTenantModel extends BaseTenantModel {
    license: LicenseModel
}
