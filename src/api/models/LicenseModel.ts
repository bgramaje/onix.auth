import { IDbModel } from '../interfaces/IDbModel';

export interface LicenseModel extends IDbModel {
    name: string,
    limitUsers: number,
}

