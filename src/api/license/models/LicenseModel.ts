import { DbModel } from '../../common/models/DbModel';

export interface LicenseModel extends DbModel {
    name: string,
    limitUsers: number,
}

