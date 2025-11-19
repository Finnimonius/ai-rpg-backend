import { ENEMY_ABILITIES } from "../data/enemies/abilitiesEnemies";
import { ALL_ENEMIES } from "../data/enemies/allEnemies";
import { ALL_LOCATIONS } from "../data/locations/allLocations";
import { EnemyAbility, EnemyInstance } from "../types/enemies.types";
import { enemyCalculator } from "../utils/helpers/enemyCalculator";

export const enemyService = {
    createEnemy(dungeonId: keyof typeof ALL_LOCATIONS, level: number): EnemyInstance {
        const dungeonEnemies = ALL_ENEMIES[dungeonId];
        const template = dungeonEnemies[Math.floor(Math.random() * dungeonEnemies.length)];

        const health = enemyCalculator.calculateHealth(template, level);

        const stats = {
            strength: enemyCalculator.calculateStat(template.stats.strength, level),
            dexterity: enemyCalculator.calculateStat(template.stats.dexterity, level),
            intelligence: enemyCalculator.calculateStat(template.stats.intelligence, level),
            wisdom: enemyCalculator.calculateStat(template.stats.wisdom, level),
            constitution: enemyCalculator.calculateStat(template.stats.constitution, level),
            luck: enemyCalculator.calculateStat(template.stats.luck, level),
        };

        const abilities = template.abilities
            .map(ability => ENEMY_ABILITIES.find(enemAbility => ability === enemAbility.id))
            .filter((ability): ability is EnemyAbility => ability !== undefined);

        return {
            template,
            level,
            currentHealth: health,
            maxHealth: health,
            stats,
            abilities,
            abilityCooldowns: new Map(),
            experience: 0,
            gold: enemyCalculator.calculateGold(template, level),
            souls: enemyCalculator.calculateSouls(template, level)

        }
    },

    createEnemyForPlayer(dungeonId: keyof typeof ALL_LOCATIONS, playerLevel: number): EnemyInstance {
        let enemyLevel = playerLevel;
        enemyLevel += Math.floor(Math.random() * 3) - 1;
        enemyLevel = Math.max(1, enemyLevel);

        return enemyService.createEnemy(dungeonId, enemyLevel)
    }
}