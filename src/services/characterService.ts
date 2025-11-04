import { ObjectId } from "mongodb";
import { CreateCharacterDto } from "../dtos/CreateCharacterDto";
import { Character } from "../models/Character";
import { CLASSES } from "../data/character/classes";
import { getStartingEquipment, getStartingInventory } from "../utils/generators/items-bulder";
import { calculateEquipmentStats, canEquipItem } from "../utils/helpers/equipmentUtils";
import { STARTER_ITEMS_ARRAY } from "../data/items/allItems";
import { calculateDerivedStats } from "../utils/helpers/statsCalculator";
import { characterRepository } from "../repositories/characterRepository";
import { EquipItemDto } from "../dtos/EquipItemDto";
import { itemService } from "./itemService";
import { UnequipItemDto } from "../dtos/UnequipItemDto";
import { Equipment } from "../types/inventory.types";
import { MoveItemDto } from "../dtos/MoveItemDto";
import { SwapEquipmentDto } from "../dtos/SwapEquipmentDto";

export const characterService = {
    async createCharacter(userId: string, createData: CreateCharacterDto) {
        const characterClass = CLASSES.find(c => c.id === createData.classId);
        if (!characterClass) throw new Error("Класс не найден");

        const startingEquipment = getStartingEquipment(createData.classId);
        const startingInventory = getStartingInventory(createData.classId);

        const equipmentStats = calculateEquipmentStats(startingEquipment, STARTER_ITEMS_ARRAY);

        const derivedStats = calculateDerivedStats(characterClass.baseStats, equipmentStats, 1);


        const characterData: Character = {
            userId: new ObjectId(userId),
            classId: characterClass.id,
            backgroundId: createData.backgroundId,
            level: 1,
            stats: characterClass.baseStats,
            derivedStats: derivedStats,
            avaliableStatsPoints: 0,
            currency: { gold: 100, souls: 0, fame: 0 },
            craftingMaterials: { wood: 0, ore: 0, leather: 0, herbs: 0, crystals: 0, relics: 0 },
            inventory: startingInventory,
            equipment: startingEquipment,
            learnedAbilities: characterClass.abilities.filter(a => a.level === 1).map(a => a.id)
        }

        return characterRepository.createCharacter(characterData)
    },

    async getCharacter(userId: string): Promise<Character | null> {
        return characterRepository.findByUserId(userId)
    },

    async equipItem(userId: string, equipData: EquipItemDto): Promise<Character> {
        const character = await characterRepository.findByUserId(userId);
        if (!character) throw new Error("Персонаж не найден");
        if (!character._id) throw new Error("ID персонажа не найден");

        const inventorySlot = character.inventory[equipData.inventoryIndex];
        if (!inventorySlot || !inventorySlot.itemId) {
            throw new Error("Предмет не найден в инвентаре");
        }

        const item = itemService.getItemById(inventorySlot.itemId);
        const canEquip = canEquipItem(item, equipData.equipmentSlot, character.level);
        if (!canEquip.canEquip) throw new Error(`Нельзя экипировать: ${canEquip.reason}`);

        const currentEquppedItem = character.equipment[equipData.equipmentSlot];

        const updatedEquipment = { ...character.equipment };
        const updatedInventory = [...character.inventory];

        updatedEquipment[equipData.equipmentSlot] = inventorySlot.itemId;
        updatedInventory[equipData.inventoryIndex] = { itemId: null, quantity: 0 };

        if (currentEquppedItem) {
            const emptySlotIndex = character.inventory.findIndex(slot => !slot.itemId);
            if (emptySlotIndex === -1) throw new Error("Нет свободного места в инвентаре");
            updatedInventory[emptySlotIndex] = { itemId: currentEquppedItem, quantity: 1 };
        }

        const updatedCharacter = await characterRepository.updateCharacter(character._id, {
            equipment: updatedEquipment,
            inventory: updatedInventory
        });

        if (!updatedCharacter) throw new Error("Не удалось обновить персонажа");
        return updatedCharacter;
    },

    async unequipItem(userId: string, unequipData: UnequipItemDto): Promise<Character> {
        const character = await characterRepository.findByUserId(userId);
        if (!character) throw new Error("Персонаж не найден");
        if (!character._id) throw new Error("ID персонажа не найден");

        const equippedItemId = character.equipment[unequipData.equipmentSlot];
        if (!equippedItemId) throw new Error("В слоте нет предмета");

        const emptySlotIndex = character.inventory.findIndex(slot => !slot.itemId);
        if (emptySlotIndex === -1) throw new Error("Нет свободного места в инвентаре");

        const updatedEquipment = { ...character.equipment };
        const updatedInventory = [...character.inventory];

        updatedEquipment[unequipData.equipmentSlot as keyof Equipment] = null;

        updatedInventory[emptySlotIndex] = {
            itemId: equippedItemId,
            quantity: 1
        };

        const updatedCharacter = await characterRepository.updateCharacter(character._id, {
            equipment: updatedEquipment,
            inventory: updatedInventory
        });

        if (!updatedCharacter) throw new Error("Не удалось обновить персонажа");
        return updatedCharacter;
    },

    async moveInventoryItem(userId: string, moveData: MoveItemDto): Promise<Character> {
        const character = await characterRepository.findByUserId(userId);
        if (!character) throw new Error("Персонаж не найден");
        if (!character._id) throw new Error("ID персонажа не найден");

        if (moveData.fromIndex < 0 || moveData.fromIndex >= character.inventory.length ||
            moveData.toIndex < 0 || moveData.toIndex >= character.inventory.length) {
            throw new Error("Неверный индекс инвентаря");
        }

        const inventorySlot = character.inventory[moveData.fromIndex];
        if (!inventorySlot || !inventorySlot.itemId) throw new Error("Предмет не найден в инвентаре");

        const updatedInventory = [...character.inventory];

        const temp = updatedInventory[moveData.fromIndex];

        updatedInventory[moveData.fromIndex] = updatedInventory[moveData.toIndex];

        updatedInventory[moveData.toIndex] = temp;

        const updatedCharacter = await characterRepository.updateCharacter(character._id, {
            inventory: updatedInventory
        });

        if (!updatedCharacter) throw new Error("Не удалось обновить персонажа");
        return updatedCharacter;
    },

    async swapEquipmentItem(userId: string, swapData: SwapEquipmentDto): Promise<Character> {
        const character = await characterRepository.findByUserId(userId);
        if (!character) throw new Error("Персонаж не найден");
        if (!character._id) throw new Error("ID персонажа не найден");

        const fromItemId = character.equipment[swapData.fromSlot];
        const toItemId = character.equipment[swapData.toSlot];

        if (!fromItemId && !toItemId) throw new Error("Оба слота пустые");

        if (fromItemId) {
            const fromItem = itemService.getItemById(fromItemId);
            const canEquipTo = canEquipItem(fromItem, swapData.toSlot, character.level);
            if (!canEquipTo.canEquip) throw new Error(`Нельзя переместить предмет в слот: ${canEquipTo.reason}`);
        }

        if (toItemId) {
            const toItem = itemService.getItemById(toItemId);
            const canEquipFrom = canEquipItem(toItem, swapData.fromSlot, character.level);
            if (!canEquipFrom.canEquip) throw new Error(`Нельзя переместить предмет в слот: ${canEquipFrom.reason}`);
        }

        const updatedEquipment = { ...character.equipment };
        const temp = updatedEquipment[swapData.fromSlot];
        updatedEquipment[swapData.fromSlot] = updatedEquipment[swapData.toSlot];
        updatedEquipment[swapData.toSlot] = temp;

        const updatedCharacter = await characterRepository.updateCharacter(character._id, {
            equipment: updatedEquipment
        });

        if (!updatedCharacter) throw new Error("Не удалось обновить персонажа");
        return updatedCharacter;
    }
}