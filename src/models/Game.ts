import { ObjectId } from 'mongodb';

type Directions = 'south' | 'southeast' | 'southwest' | 'west' | 'north' | 'northwest' | 'northeast';

type GameHistory = {
    type: 'location' | 'travel_event',
    aiText: string,
    directions: Directions
}

export interface Game {
    _id: ObjectId,
    userId: ObjectId,
    currentDungeon: string,
    currentLocation: string,
    currentLocationName: string,
    targetLocation: string | null,
    currentSteps: number,
    gameHistory: GameHistory[]
}