import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
    nickName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}