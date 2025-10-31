import { ObjectId } from 'mongodb';

export type MongoId = string | ObjectId;

export const toObjectId = (id: MongoId): ObjectId => {
    return typeof id === 'string' ? new ObjectId(id) : id;
};