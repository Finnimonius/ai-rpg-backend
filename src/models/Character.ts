import { ObjectId } from "mongodb";

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

export interface Currency {
    gold: number,
    souls: number,
    fame: number
}

export interface CraftingMaterials {
    wood: number,
    ore: number,
    leather: number,
    herbs: number,
    crystals: number,
    relics: number
}

export interface Equipment {
    weapon_main: string | null,
    weapon_off: string | null,
    helmet: string | null,
    chest: string | null,
    gloves: string | null,
    legs: string | null,
    boots: string | null,
    ring_1: string | null;
    ring_2: string | null;
    amulet: string | null;
}

export interface Character {
    _id?: ObjectId,
    userId: ObjectId,
    classId: string,
    backgroundId: string,
    level: number,
    stats: BaseStats,
    derivedStats: DerivedStats,
    avaliableStatsPoints: number,
    currency: Currency,
    craftingMaterials: CraftingMaterials,
    inventory: Array<{ itemId: string | null, quantity: number }>,
    equipment: Equipment,
    learnedAbilities: string[]
}