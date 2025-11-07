import { Equipment } from "./inventory.types";

export type ClassId = 'grey_wanderer';

export interface BaseStats {
    strength: number,
    dexterity: number,
    intelligence: number,
    wisdom: number,
    constitution: number,
    luck: number
}

export interface DerivedStats {
    health: number,
    maxHealth: number,
    mana: number,
    maxMana: number,
    attackMin: number,
    attackMax: number,
    defense: number,
    critChance: number,
    evasion: number,
}

export interface ClassConfig {
    equipment: Equipment;
}