import { Equipment } from "../../types/inventory.types";

export interface UnequipItemDto {
    equipmentSlot: keyof Equipment,
    inventoryIndex: number
}