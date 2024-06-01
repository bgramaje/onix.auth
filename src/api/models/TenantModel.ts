export type TenantModel = {
    _id: string,
    name: string,
    license: string,
    licenseExpirationDate: Date;
    users: number;
    activeUsers: Array<string>
}
