import { ALL_LOCATIONS } from "../data/locations/allLocations"
import { enemyService } from "./enemyService"

export const combatService = {
    async generateCombat(dungeonId: keyof typeof ALL_LOCATIONS, playerLevel: number) {
        const enemy = enemyService.createEnemyForPlayer(dungeonId, playerLevel)

        const combatState = {
            state: 'active' as const,
            turn: 'player' as const,
            turnNumber: 1,
            enemyHealth: enemy.currentHealth
        }

        return {
            enemy,
            combatState
        }
    }
}