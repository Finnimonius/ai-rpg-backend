import { ObjectId } from "mongodb";
import { BaseStats, DerivedStats } from "../types/character.types";
import { Equipment } from "../types/inventory.types";
import { CraftingMaterials, Currency } from "../types/currency.types";

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