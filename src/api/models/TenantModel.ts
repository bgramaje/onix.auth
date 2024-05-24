import { Document } from 'mongodb';

export type TenantModel = Document & {
    _id: string,
    name: string,
    license: string,
    expirationDate: Date;
    users: number;
    activeUsers: Array<string>
}
