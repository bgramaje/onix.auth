import { Role } from './RoleModel';

export type AuthModel = {
    _id: string,
    username: string,
    refreshToken: string,
    expiredAt: Date,
    role?: Role
}
