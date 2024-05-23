
export type TenantModel = {
    _id: string,
    name: string,
    license: string,
    expirationDate: Date;
    users: number;
    activeUsers: Array<string>
}
