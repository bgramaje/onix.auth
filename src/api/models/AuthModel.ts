import { IDbModel } from '../interfaces/IDbModel';
import { Role } from './RoleModel';

export interface AuthModel extends IDbModel {
    username: string,
    refreshToken: string,
    expiredAt: Date,
    role?: Role
}
