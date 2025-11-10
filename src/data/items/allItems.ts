import { AnyItem, ItemType, Rarity } from "../../types/items.types";
import { groupByRarity } from "../../utils/generators/items-bulder";
import { ARMOR } from "./armor";
import { CONSUMABLES } from "./consumables";
import { SHOP_ITEMS } from "./shopItems";
import { STARTER_ACCESORIES, STARTER_ARMOR, STARTER_CONSUMABLES, STARTER_WEAPONS } from "./starterGear";
import { WEAPONS } from "./weapons";

export const STARTER_ITEMS_ARRAY = [
    ...Object.values(STARTER_WEAPONS),
    ...Object.values(STARTER_ARMOR),
    ...Object.values(STARTER_ACCESORIES),
    ...Object.values(STARTER_CONSUMABLES),
];

export const ALL_ITEMS = [
    ...Object.values(WEAPONS),
    ...Object.values(ARMOR),
    ...Object.values(CONSUMABLES),
    ...Object.values(SHOP_ITEMS),
    ...STARTER_ITEMS_ARRAY
]

export const ALL_ITEMS_BY_TYPE_AND_RARITY: Record<ItemType, Record<Rarity, AnyItem[]>> = {
    weapon: groupByRarity(WEAPONS),
    armor: groupByRarity(ARMOR),
    accessory: { common: [], uncommon: [], rare: [], epic: [], legendary: [] },
    consumable: groupByRarity(CONSUMABLES),
    shopItem: groupByRarity(SHOP_ITEMS),
    quest: { common: [], uncommon: [], rare: [], epic: [], legendary: [] }
}