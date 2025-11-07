type Directions = 'south' | 'southeast' | 'southwest' | 'west' | 'north' | 'northwest' | 'northeast';

export type GameHistory = {
    type: 'location' | 'travel_event',
    aiText: string,
    directions: Directions[]
}