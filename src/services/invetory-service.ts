import { GAME_CONFIG } from '../config/game-config';
import { ClassId } from '../types/character.types';
import { InventorySlot } from '../types/inventory.types';
import { STARTER_CONSUMABLES } from '../data/items/starterGear';

export const inventoryService = {
  createStarterInventory(classId: ClassId): InventorySlot[] {
    const starterItems = this.getStarterItems(classId);
    const result = this.createInventoryWithItems(starterItems, GAME_CONFIG.INVENTORY_SIZE);
    return result;
  },

  createEmptyInventory(size: number = GAME_CONFIG.INVENTORY_SIZE): InventorySlot[] {
    return Array.from({ length: size }, (): InventorySlot => ({
      itemId: null,
      quantity: 0
    }));
  },

  createInventoryWithItems(
    items: InventorySlot[], 
    size: number = GAME_CONFIG.INVENTORY_SIZE
  ): InventorySlot[] {
    const inventory = this.createEmptyInventory(size);
    
    items.forEach((item, index) => {
      if (index < size) {
        inventory[index] = item;
      }
    });
    
    return inventory;
  },

  getStarterItems(classId: ClassId): InventorySlot[] {
    const itemsConfig: Record<ClassId, InventorySlot[]> = {
      grey_wanderer: [
        { itemId: STARTER_CONSUMABLES.HEALTH_POTION.id, quantity: 5 },
        { itemId: STARTER_CONSUMABLES.MANA_POTION.id, quantity: 3 },
        { itemId: STARTER_CONSUMABLES.BASIC_FOOD.id, quantity: 10 }
      ]
    };
    
    return itemsConfig[classId] || [];
  },

  findEmptySlot(inventory: InventorySlot[]): number {
    return inventory.findIndex(slot => !slot.itemId);
  },

  findItemSlot(inventory: InventorySlot[], itemId: string): number {
    return inventory.findIndex(slot => slot.itemId === itemId);
  },

  hasEmptySlots(inventory: InventorySlot[]): boolean {
    return inventory.some(slot => !slot.itemId);
  }
};