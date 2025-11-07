import { ObjectId } from "mongodb";
import { ALL_LOCATIONS } from "../data/locations/allLocations";
import { CreateGameDto } from "../dtos/game/CreateGameDto";
import { Game } from "../models/Game";

export const gameService = {
    async createGame(userId: string, createData: CreateGameDto) {
        const dungeon = ALL_LOCATIONS[createData.currentDungeon];
        if(!dungeon) throw new Error("Подземелье не найдено");

        const currentDungeon = createData.currentDungeon;
        const currentLocation = dungeon[0].id;
        const currentLocationName = dungeon[0].name;



        // const gameHistory = {
        //     type: 'location',
        //     aiText: 
        // }
        
        // const gameData: Game = {
        //     userId: new ObjectId(userId),
        //     currentDungeon: currentDungeon,
        //     currentLocation: currentLocation,
        //     currentLocationName: currentLocationName,
        //     targetLocation: null,
        //     currentSteps: 0,
        // }
    }
}