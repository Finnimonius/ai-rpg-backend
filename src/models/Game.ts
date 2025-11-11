import { ObjectId } from 'mongodb';
import { GameHistory } from '../types/game.types';
import { ALL_LOCATIONS } from '../data/locations/allLocations';

export interface Game {
    _id?: ObjectId,
    userId: ObjectId,
    currentDungeon: keyof typeof ALL_LOCATIONS,
    currentLocation: string,
    currentLocationName: string,
    targetLocation: string | null,
    currentSteps: number,
    gameHistories: GameHistory[]
}