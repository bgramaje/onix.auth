import { DbModel } from '../../common/models/DbModel';
import { Role } from '../../common/models/RoleModel';

export interface AuthModel extends DbModel {
    username: string,
    refreshToken: string,
    expiredAt: Date,
    role?: Role
}
