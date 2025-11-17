import { EnemyTemplate } from "../../types/enemies.types";

export const FOREST_ENEMIES: EnemyTemplate[] = [
    {
        id: 'forest_spider',
        name: 'Лесной Паук',
        description: 'Огромный паук, охотящийся в лесной чаще',
        type: 'normal',

        stats: {
            health: 25,
            strength: 8,
            dexterity: 14,
            intelligence: 3,
            constitution: 6,
            luck: 3
        },

        scaling: {
            health: 0.4,      // +40% HP за уровень
            damage: 0.3,      // +30% урона за уровень  
            defense: 0.2        // +20% брони за уровень
        },

        abilities: ['venom_bite', 'web_shot'],

        loot: ['chest'],

        experience: 20,
        gold: { min: 3, max: 8 },
        souls: { min: 2, max: 5 }
    },

    {
        id: 'forest_bandit',
        name: 'Лесной Бандит',
        description: 'Безжалостный разбойник, грабящий путников',
        type: 'normal',

        stats: {
            health: 25,
            strength: 8,
            dexterity: 14,
            intelligence: 3,
            constitution: 8,
            luck: 3
        },

        scaling: {
            health: 0.3,
            damage: 0.4,
            defense: 0.3
        },

        abilities: ['quick_attack', 'dirty_trick'],

        loot: [ 'large_chest' ],

        experience: 25,
        gold: { min: 5, max: 12 },
        souls: { min: 2, max: 5 }
    }
];