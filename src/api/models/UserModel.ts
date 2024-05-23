/* eslint-disable no-shadow */
enum Role {
    Admin = 'Admin',
    Super = 'Super',
    Client = 'Client'
}
/* eslint-enable no-shadow */

export type UserModel = {
    _id: string,
    username: string,
    tenant: string,
    role: Role.Super | Role.Admin | Role.Client,
    password: string,
}
