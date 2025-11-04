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