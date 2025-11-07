import { Equipment } from "../../types/inventory.types";

export interface EquipItemDto {
    inventoryIndex: number,
    equipmentSlot: keyof Equipment
}