import { IDbModel } from '../interfaces/IDbModel.ts';
import { Role } from './RoleModel.ts';
import { TenantModel } from './TenantModel.ts';

interface BaseUserModel extends IDbModel {
    username: string,
    role: Role.Super | Role.Admin | Role.Client,
    password: string,
}

export interface UserModel extends BaseUserModel {
    tenant?: string | null,
}

export interface AggregatedUserModel extends BaseUserModel {
    tenant?: TenantModel | null
}
