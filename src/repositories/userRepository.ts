import { ObjectId } from "mongodb";
import { getDataBase } from "../config/database";
import { User } from "../models/User";
import { CreateUserDto } from "../dtos/CreateUserDto";

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
        newUser._id = result.insertedId.toString();

        return newUser
    }

    async findByEmail(email: string): Promise<User | null> {
        const collection = this.getCollection();

        const result = await collection.findOne({email: email});

        return result
    }
}