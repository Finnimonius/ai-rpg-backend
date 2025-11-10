import { BaseStats } from './character.types';

export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable' | 'shopItem' | 'quest';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type EquipmentSlot = 'helmet' | 'chest' | 'gloves' | 'legs' | 'boots' | 'ring' | 'amulet';

export interface Item {
    id: string;
    name: string;
    type: ItemType;
    rarity: Rarity;
    value: number;
    requiredLevel?: number;
    stats?: Partial<BaseStats>; 
}

export interface Weapon extends Item {
    type: 'weapon';
    damage: { min: number; max: number };
    weaponType: string;
}

export interface Armor extends Item {
    type: 'armor';
    defense: number;
    armorType: string;
    slot: EquipmentSlot;
}

export interface Accessory extends Item {
    type: 'accessory';
    slot: EquipmentSlot;
    damage?: { min: number; max: number };
}

export interface Consumable extends Item {
    type: 'consumable';
    effect: {
        type: 'HEAL' | 'MANA_RESTORE' | 'OUT_OF_COMBAT_HEAL';
        value: number;
    };
}

export interface ShopItem extends Item {
    type: 'shopItem',
    category: string;
}

export type AnyItem = Weapon | Armor | Accessory | Consumable | ShopItem;