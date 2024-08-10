import { DbModel } from '../../common/models/DbModel';
import { Role } from '../../common/models/RoleModel';
import { TenantModel } from '../../tenant/models/TenantModel';

interface BaseUserModel extends DbModel {
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
