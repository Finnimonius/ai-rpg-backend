import { getDataBase } from "../config/database";
import { User } from "../models/User";
import { CreateUserDto } from "../dtos/user/CreateUserDto";
import { MongoId, toObjectId } from '../types/mongodb';


const COLLECTION_NAME = 'users';

export class UserRepository {
    private getCollection() {
        return getDataBase().collection<User>(COLLECTION_NAME);
    }

    async createUser(userData: CreateUserDto): Promise<User> {
        const collection = this.getCollection();

        const newUser: User = {
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await collection.insertOne(newUser);
        newUser._id = result.insertedId;

        return newUser
    }

    async findByEmail(email: string): Promise<User | null> {
        const collection = this.getCollection();

        const result = await collection.findOne({ email: email });

        return result
    }

    async findById(userId: MongoId): Promise<User | null> {
        const collection = this.getCollection()
        const objectId = toObjectId(userId);
        const result = await collection.findOne({ _id: objectId })

        return result
    }

    async updateUser(userId: string, updateData: { nickName?: string, email?: string }): Promise<User | null> {
        const collection = this.getCollection();
        const objectId = toObjectId(userId);

        const result = await collection.findOneAndUpdate(
            { _id: objectId },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        )
        return result
    }

    async updatePassword(userId: string, newHashedPassword: string): Promise<User | null> {
        const collection = this.getCollection();
        const objectId = toObjectId(userId);

        const result = await collection.findOneAndUpdate(
            {_id: objectId},
            {
                $set: {
                    password: newHashedPassword,
                    updatedAt: new Date()
                }
            },
            {returnDocument: 'after'}
        )
        return result
    }
}

export const userRepository = new UserRepository();