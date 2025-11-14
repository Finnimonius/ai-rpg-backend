import { ObjectId } from "mongodb";
import { ALL_LOCATIONS } from "../data/locations/allLocations";
import { CreateGameDto } from "../dtos/game/CreateGameDto";
import { Game } from "../models/Game";
import { GameHistory } from "../types/game.types";
import { gameRepository } from "../repositories/gameRepository";
import { NotFoundError } from "../errors/AppError";
import { MoveToLocationDto } from "../dtos/game/MoveToLocationDto";
import { generateEvent, getRandomEvent } from "../utils/generators/event-generator";
import { storyCacheService } from "./storyCacheService";

export const gameService = {
    async createGame(userId: string, createData: CreateGameDto): Promise<Game> {
        const dungeon = ALL_LOCATIONS[createData.currentDungeon];
        if (!dungeon) throw new NotFoundError("Подземелье");

        const currentDungeon = createData.currentDungeon;
        const startingLocation = dungeon[0]
        const directions = startingLocation.paths.map(path => path.direction)

        const directionsText = startingLocation.paths.map(path => path.directionName).join(' ');
        const aiPrompt = `Начини рассказ истории в стиле RPG. Мы сейчас находимся в локации ${startingLocation.name}. 
        Вот небольшое описание к ней: ${dungeon[0].description}. И в конце предложи пойти на выбор ${directionsText}`;

        const aiText = await storyCacheService.getLocationStory(userId, currentDungeon, startingLocation.id, aiPrompt)

        const gameHistory: GameHistory = {
            type: 'location',
            aiText: aiText,
            currentEvent: dungeon[0].event,
            directions: directions,
            isDirectionUsed: false,
        }

        const gameData: Game = {
            userId: new ObjectId(userId),
            currentDungeon: currentDungeon,
            currentLocation: startingLocation.id,
            currentLocationName: startingLocation.name,
            targetLocation: null,
            currentSteps: 0,
            gameHistories: [gameHistory],
        }

        return gameRepository.createGame(gameData);
    },

    async getGame(userId: string): Promise<Game | null> {
        return gameRepository.findGameById(userId)
    },

    async deleteGame(userId: string): Promise<boolean> {
        const game = await gameRepository.findGameById(userId);
        if (!game || !game._id) return false;

        return gameRepository.deleteGame(game._id)
    },

    async moveToLocation(userId: string, moveData: MoveToLocationDto): Promise<Game | null> {
        const game = await gameRepository.findGameById(userId);
        if (!game) throw new NotFoundError('Игра');
        if (!game._id) throw new Error("Отсутствует ID игры в базе данных");

        const directionName = moveData.directionName;

        if (game.currentSteps < 2) {
            const updatedHistories = [...game.gameHistories];
            const lastIndex = updatedHistories.length - 1;
            if (lastIndex >= 0) {
                updatedHistories[lastIndex] = {
                    ...updatedHistories[lastIndex],
                    isDirectionUsed: true
                };
            }

            const randomEvent = getRandomEvent();
            const currentEvent = generateEvent(randomEvent);
            if (!currentEvent) throw new NotFoundError("Событие");

            const aiPrompt = `Игрок направляется на ${directionName}. 
            На пути у нас событие ${currentEvent.title}. Описание события: ${currentEvent.description}. 
            Напиши описание в стиле RPG`;
            const aiText = await storyCacheService.getLocationStory(
                userId,
                game.currentDungeon,
                game.currentLocation,
                aiPrompt,
                currentEvent.id
            )

            const gameHistory: GameHistory = {
                type: 'travel_event',
                aiText: aiText,
                currentEvent: currentEvent,
                directions: [moveData.directionId],
                currentDirection: moveData.directionId,
                isDirectionUsed: false
            }

            const currentSteps = game.currentSteps + 1;
            const location = ALL_LOCATIONS[game.currentDungeon].find(location => location.id === game.currentLocation);
            const targetLocation = location?.paths.find(path => path.direction === moveData.directionId)?.targetLocationId;
            if (!targetLocation) throw new NotFoundError("Направление");

            const gameHistories = [
                ...updatedHistories,
                gameHistory
            ]

            const gameData: Game = {
                userId: new ObjectId(userId),
                currentDungeon: game.currentDungeon,
                currentLocation: game.currentLocation,
                currentLocationName: game.currentLocationName,
                targetLocation: targetLocation,
                currentSteps: currentSteps,
                gameHistories: gameHistories,
            }

            return gameRepository.updateGame(game._id, gameData)
        } else {
            const updatedHistories = [...game.gameHistories];
            const lastIndex = updatedHistories.length - 1;
            if (lastIndex >= 0) {
                updatedHistories[lastIndex] = {
                    ...updatedHistories[lastIndex],
                    isDirectionUsed: true
                };
            }

            const currentSteps = 0;
            const currentLocation = game.targetLocation;

            const location = ALL_LOCATIONS[game.currentDungeon].find(location => location.id === currentLocation);
            if (!location) throw new NotFoundError('Локация');

            let currentEvent;
            if (location.event) {
                currentEvent = location.event
            } else {
                currentEvent = null
            }

            const aiPrompt = `Игрок направляется на ${directionName}. 
            Игрок попадает в локацию ${currentLocation}. Описание события: ${location.description}. 
            Напиши описание в стиле RPG`;
            const aiText = await storyCacheService.getLocationStory(
                userId,
                game.currentDungeon,
                location.id,
                aiPrompt,
            )

            const directions = location.paths.map(path => path.direction)

            const gameHistory: GameHistory = {
                type: 'location',
                aiText: aiText,
                currentEvent: currentEvent,
                directions: directions,
                isDirectionUsed: false
            }

            const gameHistories = [
                ...updatedHistories,
                gameHistory
            ]

            const gameData: Game = {
                userId: new ObjectId(userId),
                currentDungeon: game.currentDungeon,
                currentLocation: location.id,
                currentLocationName: location.name,
                targetLocation: null,
                currentSteps: currentSteps,
                gameHistories: gameHistories,
            }

            return gameRepository.updateGame(game._id, gameData)
        }

    }
}