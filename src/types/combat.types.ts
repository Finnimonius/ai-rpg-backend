export type CombatRewardType = 'chest'

export interface CombatState {
    state: 'active' | 'victory' | 'defeat' | 'fled';
    turn: 'player' | 'enemy';
    turnNumber: number;
    enemyHealth: number;
}

export interface CombatAction {
    type: 'ability' | 'attack' | 'item';
    abilityId?: string;
    itemId?: string;
}