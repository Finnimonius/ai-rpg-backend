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

interface EquipResult {
    canEquip: boolean;
    reason?: 'wrong_type' | 'low_level' | 'success';
}

export const canEquipItem = (item: AnyItem, slot: keyof Equipment, level: number): EquipResult => {

    const equippableTypes = ['weapon', 'armor', 'accessory'] as const;
    if (!equippableTypes.includes(item.type as 'weapon' | 'armor' | 'accessory')) {
        return { canEquip: false, reason: 'wrong_type' };
    }

    if (!('requiredLevel' in item)) {
        return { canEquip: false, reason: 'wrong_type' };
    }

    if (item.requiredLevel && level < item.requiredLevel) {
        return { canEquip: false, reason: 'low_level' };
    }

    switch (slot) {
        case 'weapon_main':
        case 'weapon_off':
            if (item.type !== 'weapon') {
                return { canEquip: false, reason: 'wrong_type' };
            }
            return { canEquip: true, reason: 'success' };
        case 'helmet':
        case 'chest':
        case 'gloves':
        case 'legs':
        case 'boots':
            if (item.type !== 'armor' || (item as Armor).slot !== slot) {
                return { canEquip: false, reason: 'wrong_type' };
            }
            return { canEquip: true, reason: 'success' };
        case 'ring_1':
        case 'ring_2':
            if (item.type !== 'accessory' || !(item as Accessory).slot?.startsWith('ring')) {
                return { canEquip: false, reason: 'wrong_type' };
            }
            return { canEquip: true, reason: 'success' };
        case 'amulet':
            if (item.type !== 'accessory' || (item as Accessory).slot !== 'amulet') {
                return { canEquip: false, reason: 'wrong_type' };
            }
            return { canEquip: true, reason: 'success' };
        default:
            return { canEquip: false, reason: 'wrong_type' };
    }
};