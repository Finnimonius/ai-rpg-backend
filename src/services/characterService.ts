import { ObjectId } from "mongodb";
import { CreateCharacterDto } from "../dtos/CreateCharacterDto";
import { Character } from "../models/Character";
import { CLASSES } from "../data/character/classes";
import { getStartingEquipment, getStartingInventory } from "../utils/generators/items-bulder";
import { calculateEquipmentStats } from "../utils/helpers/equipmentUtils";
import { STARTER_ITEMS_ARRAY } from "../data/items/allItems";
import { calculateDerivedStats } from "../utils/helpers/statsCalculator";
import { characterRepository } from "../repositories/characterRepository";

export const characterService = {
    async createCharacter(userId: string, createData: CreateCharacterDto) {
        const characterClass = CLASSES.find(c => c.id === createData.classId);
        if(!characterClass) throw new Error("Класс не найден");

        const startingEquipment = getStartingEquipment(createData.classId);
        const startingInventory = getStartingInventory(createData.classId);

        const equipmentStats = calculateEquipmentStats(startingEquipment, STARTER_ITEMS_ARRAY);

        const derivedStats = calculateDerivedStats(characterClass.baseStats, equipmentStats, 1);
        
        
        const characterData: Character = {
            userId: new ObjectId(userId),
            classId: characterClass.id,
            backgroundId: createData.backgroundId,
            level: 1,
            stats: characterClass.baseStats,
            derivedStats: derivedStats,
            avaliableStatsPoints: 0,
            currency: { gold: 100, souls: 0, fame: 0 },
            craftingMaterials: { wood: 0, ore: 0, leather: 0, herbs: 0, crystals: 0, relics: 0 },
            inventory: startingInventory,
            equipment: startingEquipment,
            learnedAbilities: characterClass.abilities.filter(a => a.level === 1).map(a => a.id)
        }

        return characterRepository.createCharacter(characterData)
    },

    async getCharacter(userId: string): Promise<Character | null> {
        return characterRepository.findByUserId(userId)
    }
}