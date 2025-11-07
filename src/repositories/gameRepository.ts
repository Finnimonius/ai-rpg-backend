import { getDataBase } from "../config/database";
import { Game } from "../models/Game";

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
}

export const gameRepository = new GameRepository();