import { classConfigs } from "../../data/items/starterGear";
import { ClassId } from "../../types/character.types";
import { Equipment } from "../../types/inventory.types";
import { AnyItem, Rarity } from "../../types/items.types";

export const getStartingEquipment = (classId: ClassId): Equipment => {
    return classConfigs[classId].equipment;
};

export const groupByRarity = (items: Record<string, AnyItem>): Record<Rarity, AnyItem[]> => {
    const result: Record<Rarity, AnyItem[]> = {
        common: [],
        uncommon: [],
        rare: [],
        epic: [],
        legendary: []
    }

    Object.values(items).forEach(item => {
        result[item.rarity].push(item)
    });

    return result
}