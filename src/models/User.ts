import { ObjectId } from 'mongodb';
import { UserRole } from '../types/role';

export interface User {
    _id?: ObjectId;
    nickName: string;
    email: string;
    password: string;
    role?: UserRole;
    createdAt: Date;
    updatedAt: Date;
}