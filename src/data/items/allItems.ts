import { STARTER_ACCESORIES, STARTER_ARMOR, STARTER_CONSUMABLES, STARTER_WEAPONS } from "./starterGear";

export const ALL_ITEMS_ARRAY = [
    ...Object.values(STARTER_WEAPONS),
    ...Object.values(STARTER_ARMOR),
    ...Object.values(STARTER_ACCESORIES),
    ...Object.values(STARTER_CONSUMABLES)
];