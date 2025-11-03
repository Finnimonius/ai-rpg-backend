import { BaseStats } from "../../types/character.types";
import { Equipment } from "../../types/inventory.types";
import { Accessory, AnyItem, Armor, Weapon } from "../../types/items.types";

export interface EquipmentStats {
    stats: BaseStats;
    damage: { min: number; max: number };
    defense: number;
}

export const calculateEquipmentStats = (equipment: Equipment, allItems: AnyItem[]): EquipmentStats => {
    const result: EquipmentStats = {
        stats: {
            strength: 0,
            dexterity: 0,
            intelligence: 0,
            wisdom: 0,
            constitution: 0,
            luck: 0,
        },
        damage: { min: 0, max: 0 },
        defense: 0,
    };

    Object.values(equipment).forEach(itemId => {
        if (!itemId) return;

        const item = allItems.find(i => i.id === itemId);
        if (!item) return;

        if (item.stats) {
            Object.entries(item.stats).forEach(([stat, value]) => {
                const statKey = stat as keyof BaseStats;
                if (typeof value === 'number') {
                    result.stats[statKey] += value;
                }
            });
        }

        if (item.type === 'weapon') {
            const weapon = item as Weapon;
            result.damage.min += weapon.damage.min;
            result.damage.max += weapon.damage.max;
        }

        if (item.type === 'accessory') {
            const accessory = item as Accessory;
            if (accessory.damage) {
                result.damage.min += accessory.damage.min;
                result.damage.max += accessory.damage.max;
            }
        }

        if (item.type === 'armor') {
            const armor = item as Armor;
            result.defense += armor.defense;
        }
    });

    return result;
};