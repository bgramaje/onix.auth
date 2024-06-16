import { IDbModel } from '../interfaces/IDbModel.ts';
import { LicenseModel } from './LicenseModel.ts';
import { Role } from './RoleModel.ts';

export interface UserModel extends IDbModel {
    username: string,
    tenant?: string | null,
    role: Role.Super | Role.Admin | Role.Client,
    password: string,
}

export interface AggregatedUserModel extends UserModel {
    license: LicenseModel
}
