import { CombatState } from "./combat.types";
import { EnemyInstance } from "./enemies.types";
import { AnyItem, ItemType } from "./items.types";

export type Directions = 'south' | 'southeast' | 'southwest' | 'west' | 'north' | 'northwest' | 'northeast';

export type GameHistory = {
    type: 'location' | 'travel_event',
    aiText: string,
    currentEvent: CurrentEvent | null,
    directions: Directions[],
    currentDirection?: Directions,
    isDirectionUsed?: boolean,
}

export type EventType = 'combat' | 'treasure'

export type CurrentEvent = {
    eventType: EventType,
    id: string,
    title: string,
    description: string,
    // Treasure - переделать под общий тип
    container?: TreasureType[],
    rewardBox?: TreasureType,
    reward?: AnyItem,

    // Combat
    enemy?: EnemyInstance,
    combatState?: CombatState,

    isOpened: boolean,
    isTaken: boolean,
    isSkipped?: boolean,
}

export type TreasureType = 'chest' | 'large_chest' | 'gemstones' | 'bag';

export type TreasureEvent = {
    id: string,
    title: string,
    description: string,
    container: TreasureType[],
}

export type Treasure = {
    type: ItemType,
    category?: string,
    chance: number
}

export interface TreasureContainer {
    rewards: Treasure[]
}