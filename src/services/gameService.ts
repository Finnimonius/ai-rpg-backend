import { ALL_LOCATIONS } from "../data/locations/allLocations";
import { CreateGameDto } from "../dtos/game/CreateGameDto";

export const gameService = {
    async createGame(userId: string, createData: CreateGameDto) {
        const dungeon = ALL_LOCATIONS[createData.currentDungeon];
        if(!dungeon) throw new Error("Подземелье не найдено");
        
    }
}