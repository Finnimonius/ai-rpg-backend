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

    async findGameById(userId: MongoId): Promise<Game | null> {
        const collection = this.getCollection();

        const objectId = toObjectId(userId);
        const result = await collection.findOne({ userId: objectId })

        return result
    }

    async deleteGame(gameId: MongoId): Promise<boolean> {
        const collection = this.getCollection();
        const objectId = toObjectId(gameId);

        const result = await collection.deleteOne(
            {_id: objectId}
        )

        return result.deletedCount === 1
    }
}

export const gameRepository = new GameRepository();