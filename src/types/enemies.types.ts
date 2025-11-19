import { BaseStats } from "./character.types";
import { AnyItem } from "./items.types";

// Шаблон противника
export interface EnemyTemplate {
    id: string,
    name: string,
    description: string,
    type: 'normal' | 'elite' | 'boss',

    // Базовые множители
    stats: {
        health: number;
        strength: number,
        dexterity: number,
        intelligence: number,
        wisdom: number,
        constitution: number,
        luck: number
    },

    scaling: {
        health: number,
        damage: number,
        defense: number
    },

    abilities: string[],

    loot: string[]

    experience: number,
    gold: { min: number, max: number },
    souls: { min: number, max: number },
}

// Экземпляр противника
export interface EnemyInstance {
    template: EnemyTemplate,
    level: number,
    currentHealth: number,
    maxHealth: number,
    stats: BaseStats
    abilities: EnemyAbility[],
    reward: AnyItem,
    experience: number,
    gold: number,
    souls: number
}

export interface EnemyAbility {
    id: string,
    name: string,
    description: string,

    type: 'attack' | 'debuff' | 'buff' | 'special',
    cooldonw: {
        current: number,
        max: number
    },

    conditions: {
        minHealth?: number,
        maxHealth?: number,
        playerHasBuff?: string,
        playerHasDebuff?: string,
        chance?: number,
        firstTurnOnly?: boolean,
        executeThreshold?: number;
    },

    effects: Array<{
        type: 'DAMAGE' | 'HEAL' | 'DEBUFF' | 'DOT' | 'CLEANSE' | 'SPECIAL',
        target: 'player' | 'self',
        value?: number,
        multiplier?: number,

        buffStat?: BaseStats,
        buffValue?: number,
        duration?: number,

        dotDamage?: number,
        dotDuration?: number,
        chance?: number
    }>,

    priority: number
}