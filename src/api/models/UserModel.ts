import { Role } from './RoleModel';

export type UserModel = {
    _id: string,
    username: string,
    tenant: string,
    role: Role.Super | Role.Admin | Role.Client,
    password: string,
}
