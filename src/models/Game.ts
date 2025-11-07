import { ObjectId } from 'mongodb';

type CurrentDungeon = 'forest' | 'desert';
type Directions = 'south' | 'southeast' | 'southwest' | 'west' | 'north' | 'northwest' | 'northeast';

type GameHistory = {
    type: 'location' | 'travel_event',
    aiText: string,
    directions: Directions
}

export interface Game {
    _id: ObjectId,
    userId: ObjectId,
    currentDungeon: CurrentDungeon,
    currentLocation: string,
    targetLocation: string,
    currentSteps: number,
    gameHistory: GameHistory[]
}