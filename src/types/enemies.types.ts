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
    gold: {min: number, max: number},
    souls: {min: number, max: number},
}

// Экземпляр противника
export interface EnemyInstance {
    template: EnemyTemplate,
    level: number,
    currentHealth: number,
    maxHealth: number,
    stats: number
}