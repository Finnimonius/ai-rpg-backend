import { ObjectId } from 'mongodb';
import { GameHistory } from '../types/game.types';

export interface Game {
    _id?: ObjectId,
    userId: ObjectId,
    currentDungeon: string,
    currentLocation: string,
    currentLocationName: string,
    targetLocation: string | null,
    currentSteps: number,
    gameHistory: GameHistory[]
}