import { EnemyTemplate } from "../../types/enemies.types";

export const enemyCalculator = {
    calculateHealth(template: EnemyTemplate, level: number): number {
        const baseHealth = template.stats.health;
        const scaling = template.scaling.health;

        return Math.floor(baseHealth + (baseHealth * scaling * (level - 1)))
    },

    calculateStat(baseStat: number, level: number): number {
        return Math.floor(baseStat + (level - 1) * 0.5)
    },

    calculateDamage(template: EnemyTemplate, level: number): { min: number, max: number } {
        const baseDamage = template.stats.strength;
        const scaling = template.scaling.damage;

        const damage = baseDamage + (baseDamage * scaling * (level - 1));

        return {
            min: Math.floor(damage * 0.8),
            max: Math.floor(damage * 1.2),
        }
    },

    calculateDefense(template: EnemyTemplate, level: number): number {
        const baseDefense = template.stats.constitution;
        const scaling = template.scaling.defense;

        return Math.floor((baseDefense * 0.5) + (baseDefense * scaling * (level - 1)));
    },

    calculateExperience(template: EnemyTemplate, enemyLevel: number, playerLevel: number): number {
        const baseExp = template.experience;
        let exp = baseExp * enemyLevel;

        const levelDiff = playerLevel - enemyLevel;
        if (levelDiff > 0) {
            exp = Math.max(1, exp * Math.pow(0.9, levelDiff)); // -10% за каждый уровень выше
        } else if (levelDiff < 0) {
            exp = exp * Math.pow(1.1, Math.abs(levelDiff)); // +10% за каждый уровень ниже
        }

        return Math.floor(exp);
    },

    calculateGold(template: EnemyTemplate, level: number): number {
        const baseGold = template.gold;
        const multiplier = 1 + (level - 1) * 0.3;

        return Math.floor((Math.random() * (baseGold.max - baseGold.min) + baseGold.min) * multiplier);
    }
}