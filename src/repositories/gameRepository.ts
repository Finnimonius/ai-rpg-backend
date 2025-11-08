import { getDataBase } from "../config/database";
import { Game } from "../models/Game";
import { MongoId, toObjectId } from "../types/mongodb";

const COLLECTION_NAME = 'game';

export class GameRepository {
    private getCollection() {
        return getDataBase().collection<Game>(COLLECTION_NAME);
    }

    async createGame(gameData: Game): Promise<Game> {
        const collection = this.getCollection();

        const result = await collection.insertOne(gameData);

        const createdGame: Game = {
            ...gameData,
            _id: result.insertedId
        }

        return createdGame
    }

    async findGameById(userId: MongoId) {
        const collection = this.getCollection();

        const objectId = toObjectId(userId);
        const result = await collection.findOne({ userId: objectId })

        return result
    }
}

export const gameRepository = new GameRepository();