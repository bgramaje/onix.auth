import { ObjectId } from 'mongodb';

export type UserModel = {
    _id: ObjectId | string,
    username: string,
    password: string,
}
