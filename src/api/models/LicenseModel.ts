import { Document } from 'mongodb';

export type LicenseModel = Document & {
    _id: string,
    name: string,
    limitUsers: number,
}
