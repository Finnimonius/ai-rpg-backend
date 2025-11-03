import { getDataBase } from "../config/database";
import { Character } from "../models/Character";
import { Equipment } from "../types/inventory.types";
import { MongoId, toObjectId } from "../types/mongodb";

const COLLECTION_NAME = 'characters';

export class CharacterRepository {
    private getCollection() {
        return getDataBase().collection<Character>(COLLECTION_NAME);
    }

    async createCharacter(characterData: Character): Promise<Character> {
        const collection = this.getCollection();

        const result = await collection.insertOne(characterData);

        const createdCharacter: Character = {
            ...characterData,
            _id: result.insertedId
        }

        return createdCharacter
    }

    async findByUserId(userId: MongoId): Promise<Character | null> {
        const collection = this.getCollection();

        const objectId = toObjectId(userId);
        const result = await collection.findOne({ userId: objectId })

        return result
    }

    async updateCharacter(characterId: MongoId, updateData: Partial<Character>): Promise<Character | null> {
        const collection = this.getCollection();
        const objectId = toObjectId(characterId);

        const result = await collection.findOneAndUpdate(
            { _id: objectId },
            {
                $set: {
                    ...updateData
                }
            },
            { returnDocument: 'after' }
        )

        return result
    }

    async deleteCharacter(characterId: MongoId): Promise<boolean> {
        const collection = this.getCollection();
        const objectId = toObjectId(characterId);

        const result = await collection.deleteOne(
            { _id: objectId }
        )

        if (result) {
            return true
        }

        return false
    }

    async equipItem(characterId: MongoId, equipmentSlot: keyof Equipment, itemId: string): Promise<Character | null> {
        const collection = this.getCollection();
        const objectId = toObjectId(characterId);

        const result = await collection.findOneAndUpdate(
            { _id: objectId },
            {
                $set: {
                    [`equipment.${equipmentSlot}`]: itemId
                }
            },
            { returnDocument: 'after' }
        )

        return result
    }

    async unequipItem(characterId: MongoId, equipmentSlot: keyof Equipment): Promise<Character | null> {
        const collection = this.getCollection();
        const objectId = toObjectId(characterId);

        const result = await collection.findOneAndUpdate(
            { _id: objectId },
            {
                $set: {
                    [`equipment.${equipmentSlot}`]: null
                }
            },
            { returnDocument: 'after' }
        )

        return result
    }
}

export const characterRepository = new CharacterRepository();