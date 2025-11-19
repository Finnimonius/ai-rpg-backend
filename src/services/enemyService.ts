import { ALL_ENEMIES } from "../data/enemies/allEnemies";
import { ALL_LOCATIONS } from "../data/locations/allLocations";
import { EnemyInstance } from "../types/enemies.types";
import { enemyCalculator } from "../utils/helpers/enemyCalculator";

// export const enemyService = {
//     createEnemy(dungeonId: keyof typeof ALL_LOCATIONS, level: number): EnemyInstance {
//         const dungeonEnemies = ALL_ENEMIES[dungeonId];
//         const template = dungeonEnemies[Math.floor(Math.random() * dungeonEnemies.length)];

//         const health = enemyCalculator.calculateHealth(template, level);
//         const damage = enemyCalculator.calculateDamage(template, level);
//         const defense = enemyCalculator.calculateDefense(template, level);

//         const stats = {
//             strength: enemyCalculator.calculateStat(template.stats.strength, level),
//             dexterity: enemyCalculator.calculateStat(template.stats.dexterity, level),
//             intelligence: enemyCalculator.calculateStat(template.stats.intelligence, level),
//             wisdom: enemyCalculator.calculateStat(template.stats.wisdom, level),
//             constitution: enemyCalculator.calculateStat(template.stats.constitution, level),
//             luck: enemyCalculator.calculateStat(template.stats.luck, level),
//         };

//         const abilities = [];

//         return {
//             template,
//             level,
//             currentHealth: health,
//             maxHealth: health,
//             stats,
//             abilities,


//         }
//     }
// }