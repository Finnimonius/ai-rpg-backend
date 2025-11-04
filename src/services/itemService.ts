import { ALL_ITEMS } from "../data/items/allItems";
import { AnyItem } from "../types/items.types";

export const itemService = {
    getItemById(itemId: string): AnyItem {
        const item = ALL_ITEMS.find(item => item.id === itemId);

        if(!item) throw new Error(`Предмет с ID ${itemId} не найден`);
        
        return item
    },

    getAllItems(): AnyItem[] {
        return ALL_ITEMS
    }
}