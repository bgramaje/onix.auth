import { DbModel } from '../../common/models/DbModel';
import { LicenseModel } from '../../license/models/LicenseModel';

interface BaseTenantModel extends DbModel {
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
