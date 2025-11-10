import { ObjectId } from "mongodb";
import { ALL_LOCATIONS } from "../data/locations/allLocations";
import { CreateGameDto } from "../dtos/game/CreateGameDto";
import { Game } from "../models/Game";
import { aiService } from "./aiService";
import { GameHistory } from "../types/game.types";
import { gameRepository } from "../repositories/gameRepository";
import { NotFoundError } from "../errors/AppError";

export const gameService = {
    async createGame(userId: string, createData: CreateGameDto) {
        const dungeon = ALL_LOCATIONS[createData.currentDungeon];
        if (!dungeon) throw new NotFoundError("Подземелье");

        const currentDungeon = createData.currentDungeon;
        const startingLocation = dungeon[0]
        const directions = startingLocation.paths.map(path => path.direction)

        const directionsText = startingLocation.paths.map(path => path.directionName).join(' ');
        const aiPrompt = `Начини рассказ истории в стиле RPG. Мы сейчас находимся в локации ${startingLocation.name}. 
        Вот небольшое описание к ней: ${dungeon[0].description}. И в конце предложи пойти на выбор ${directionsText}`;

        const aiText = await aiService.generateText(aiPrompt);

        const gameHistory: GameHistory = {
            type: 'location',
            aiText: aiText,
            directions: directions
        }

        const gameData: Game = {
            userId: new ObjectId(userId),
            currentDungeon: currentDungeon,
            currentLocation: startingLocation.id,
            currentLocationName: startingLocation.name,
            targetLocation: null,
            currentSteps: 0,
            gameHistory: [gameHistory],
        }

        return gameRepository.createGame(gameData);
    },

    async getGame(userId: string): Promise<Game | null> {
        return gameRepository.findGameById(userId)
    }
}