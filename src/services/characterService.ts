import { ObjectId } from "mongodb";
import { CreateCharacterDto } from "../dtos/character/CreateCharacterDto";
import { Character } from "../models/Character";
import { CLASSES } from "../data/character/classes";
import { getStartingEquipment } from "../utils/generators/items-bulder";
import { calculateEquipmentStats, canEquipItem } from "../utils/helpers/equipmentUtils";
import { ALL_ITEMS, STARTER_ITEMS_ARRAY } from "../data/items/allItems";
import { calculateDerivedStats } from "../utils/helpers/statsCalculator";
import { characterRepository } from "../repositories/characterRepository";
import { EquipItemDto } from "../dtos/character/EquipItemDto";
import { itemService } from "./itemService";
import { UnequipItemDto } from "../dtos/character/UnequipItemDto";
import { Equipment } from "../types/inventory.types";
import { MoveItemDto } from "../dtos/character/MoveItemDto";
import { SwapEquipmentDto } from "../dtos/character/SwapEquipmentDto";
import { inventoryService } from "./invetoryService";
import { GAME_CONFIG } from "../config/game-config";
import { AddItemToInventory } from "../dtos/character/AddItemToInventoryDto";
import { NotFoundError, ValidationError, InventoryFullError, EquipmentError } from '../errors/AppError';
import { BACKGROUNDS } from "../data/character/backgrounds";
import { ALL_ABILITIES } from "../data/character/allAbilities";


export const characterService = {
    async createCharacter(userId: string, createData: CreateCharacterDto): Promise<Character> {
        const characterClass = CLASSES.find(c => c.id === createData.classId);
        if (!characterClass) throw new NotFoundError("Класс");

        const startingEquipment = getStartingEquipment(createData.classId);
        const startingInventory = inventoryService.createStarterInventory(createData.classId);

        const equipmentStats = calculateEquipmentStats(startingEquipment, STARTER_ITEMS_ARRAY);

        const isValidBackground = BACKGROUNDS.some(bg => bg.id === createData.backgroundId);
        if (!isValidBackground) throw new ValidationError('Неверный бэкграунд');

        const baseStats = { ...characterClass.baseStats };
        const totalStats = {
            strength: baseStats.strength + equipmentStats.stats.strength,
            dexterity: baseStats.dexterity + equipmentStats.stats.dexterity,
            intelligence: baseStats.intelligence + equipmentStats.stats.intelligence,
            wisdom: baseStats.wisdom + equipmentStats.stats.wisdom,
            constitution: baseStats.constitution + equipmentStats.stats.constitution,
            luck: baseStats.luck + equipmentStats.stats.luck,
        };

        const derivedStats = calculateDerivedStats(totalStats, equipmentStats, GAME_CONFIG.STARTING_LEVEL);

        const characterData: Character = {
            userId: new ObjectId(userId),
            classId: characterClass.id,
            backgroundId: createData.backgroundId,
            level: GAME_CONFIG.STARTING_LEVEL,
            experience: 0,
            baseStats: baseStats,
            stats: totalStats,
            derivedStats: derivedStats,
            avaliableStatsPoints: GAME_CONFIG.STARTING_STAT_POINTS,
            currency: {
                gold: GAME_CONFIG.STARTING_GOLD,
                souls: 0,
                fame: 0
            },
            craftingMaterials: { wood: 0, ore: 0, leather: 0, herbs: 0, crystals: 0, relics: 0 },
            inventory: startingInventory,
            equipment: startingEquipment,
            learnedAbilities: characterClass.abilities.filter(a => a.level === 1)
        }

        return characterRepository.createCharacter(characterData)
    },

    async getCharacter(userId: string): Promise<Character | null> {
        return characterRepository.findByUserId(userId)
    },

    async deleteCharacter(userId: string) {
        const character = await characterRepository.findByUserId(userId);
        if (!character) return false;
        if (!character._id) return false;

        return characterRepository.deleteCharacter(character._id)
    },

    async equipItem(userId: string, equipData: EquipItemDto): Promise<Character> {
        const character = await characterRepository.findByUserId(userId);
        if (!character) throw new NotFoundError("Персонаж");
        if (!character._id) throw new Error("Отсутствует ID персонажа в базе данных");

        const inventorySlot = character.inventory[equipData.inventoryIndex];
        if (!inventorySlot || !inventorySlot.itemId) {
            throw new ValidationError("Предмет не найден в инвентаре");
        }

        const item = itemService.getItemById(inventorySlot.itemId);
        const canEquip = canEquipItem(item, equipData.equipmentSlot, character.level);
        if (!canEquip.canEquip) throw new EquipmentError(`Нельзя экипировать: ${canEquip.reason}`);

        const currentEquppedItem = character.equipment[equipData.equipmentSlot];

        const updatedEquipment = { ...character.equipment };
        const updatedInventory = [...character.inventory];

        updatedEquipment[equipData.equipmentSlot] = inventorySlot.itemId;

        if (currentEquppedItem) {
            updatedInventory[equipData.inventoryIndex] = {
                itemId: currentEquppedItem,
                quantity: 1
            };
        } else {
            updatedInventory[equipData.inventoryIndex] = { itemId: null, quantity: 0 };
        }

        const equipmentStats = calculateEquipmentStats(updatedEquipment, ALL_ITEMS);
        const totalStats = {
            strength: character.baseStats.strength + equipmentStats.stats.strength,
            dexterity: character.baseStats.dexterity + equipmentStats.stats.dexterity,
            intelligence: character.baseStats.intelligence + equipmentStats.stats.intelligence,
            wisdom: character.baseStats.wisdom + equipmentStats.stats.wisdom,
            constitution: character.baseStats.constitution + equipmentStats.stats.constitution,
            luck: character.baseStats.luck + equipmentStats.stats.luck,
        };
        const derivedStats = calculateDerivedStats(totalStats, equipmentStats, character.level);

        const updatedCharacter = await characterRepository.updateCharacter(character._id, {
            equipment: updatedEquipment,
            inventory: updatedInventory,
            stats: totalStats,
            derivedStats: derivedStats
        });

        if (!updatedCharacter) throw new Error("Ошибка базы данных при обновлении персонажа");
        return updatedCharacter;
    },

    async unequipItem(userId: string, unequipData: UnequipItemDto): Promise<Character> {
        const character = await characterRepository.findByUserId(userId);
        if (!character) throw new NotFoundError("Персонаж");
        if (!character._id) throw new Error("Отсутствует ID персонажа в базе данных");

        const equippedItemId = character.equipment[unequipData.equipmentSlot];
        if (!equippedItemId) throw new EquipmentError("В слоте нет предмета");

        if (unequipData.inventoryIndex < 0 || unequipData.inventoryIndex >= character.inventory.length) {
            throw new EquipmentError("Неверный индекс инвентаря");
        }

        const targetSlot = character.inventory[unequipData.inventoryIndex];
        if (targetSlot.itemId) {
            throw new EquipmentError("Целевой слот инвентаря занят");
        }

        const updatedEquipment = { ...character.equipment };
        const updatedInventory = [...character.inventory];

        updatedEquipment[unequipData.equipmentSlot as keyof Equipment] = null;

        updatedInventory[unequipData.inventoryIndex] = {
            itemId: equippedItemId,
            quantity: 1
        };

        const equipmentStats = calculateEquipmentStats(updatedEquipment, ALL_ITEMS);
        const totalStats = {
            strength: character.baseStats.strength + equipmentStats.stats.strength,
            dexterity: character.baseStats.dexterity + equipmentStats.stats.dexterity,
            intelligence: character.baseStats.intelligence + equipmentStats.stats.intelligence,
            wisdom: character.baseStats.wisdom + equipmentStats.stats.wisdom,
            constitution: character.baseStats.constitution + equipmentStats.stats.constitution,
            luck: character.baseStats.luck + equipmentStats.stats.luck,
        };
        const derivedStats = calculateDerivedStats(totalStats, equipmentStats, character.level);

        const updatedCharacter = await characterRepository.updateCharacter(character._id, {
            equipment: updatedEquipment,
            inventory: updatedInventory,
            stats: totalStats,
            derivedStats: derivedStats
        });

        if (!updatedCharacter) throw new Error("Ошибка базы данных при обновлении персонажа");
        return updatedCharacter;
    },

    async moveInventoryItem(userId: string, moveData: MoveItemDto): Promise<Character> {
        const character = await characterRepository.findByUserId(userId);
        if (!character) throw new NotFoundError("Персонаж");
        if (!character._id) throw new Error("Отсутствует ID персонажа в базе данных");

        if (moveData.fromIndex < 0 || moveData.fromIndex >= character.inventory.length ||
            moveData.toIndex < 0 || moveData.toIndex >= character.inventory.length) {
            throw new EquipmentError("Неверный индекс инвентаря");
        }

        const inventorySlot = character.inventory[moveData.fromIndex];
        if (!inventorySlot || !inventorySlot.itemId) throw new ValidationError("Предмет не найден в указанном слоте");

        const updatedInventory = [...character.inventory];

        const temp = updatedInventory[moveData.fromIndex];

        updatedInventory[moveData.fromIndex] = updatedInventory[moveData.toIndex];

        updatedInventory[moveData.toIndex] = temp;

        const updatedCharacter = await characterRepository.updateCharacter(character._id, {
            inventory: updatedInventory
        });

        if (!updatedCharacter) throw new Error("Ошибка базы данных при обновлении персонажа");
        return updatedCharacter;
    },

    async swapEquipmentItem(userId: string, swapData: SwapEquipmentDto): Promise<Character> {
        const character = await characterRepository.findByUserId(userId);
        if (!character) throw new NotFoundError("Персонаж");
        if (!character._id) throw new Error("Отсутствует ID персонажа в базе данных");

        const fromItemId = character.equipment[swapData.fromSlot];
        const toItemId = character.equipment[swapData.toSlot];

        if (!fromItemId && !toItemId) throw new EquipmentError("Оба слота пустые");

        if (fromItemId) {
            const fromItem = itemService.getItemById(fromItemId);
            const canEquipTo = canEquipItem(fromItem, swapData.toSlot, character.level);
            if (!canEquipTo.canEquip) throw new EquipmentError(`Нельзя переместить предмет в слот: ${canEquipTo.reason}`);
        }

        if (toItemId) {
            const toItem = itemService.getItemById(toItemId);
            const canEquipFrom = canEquipItem(toItem, swapData.fromSlot, character.level);
            if (!canEquipFrom.canEquip) throw new EquipmentError(`Нельзя переместить предмет в слот: ${canEquipFrom.reason}`);
        }

        const updatedEquipment = { ...character.equipment };
        const temp = updatedEquipment[swapData.fromSlot];
        updatedEquipment[swapData.fromSlot] = updatedEquipment[swapData.toSlot];
        updatedEquipment[swapData.toSlot] = temp;

        const equipmentStats = calculateEquipmentStats(updatedEquipment, STARTER_ITEMS_ARRAY);
        const totalStats = {
            strength: character.baseStats.strength + equipmentStats.stats.strength,
            dexterity: character.baseStats.dexterity + equipmentStats.stats.dexterity,
            intelligence: character.baseStats.intelligence + equipmentStats.stats.intelligence,
            wisdom: character.baseStats.wisdom + equipmentStats.stats.wisdom,
            constitution: character.baseStats.constitution + equipmentStats.stats.constitution,
            luck: character.baseStats.luck + equipmentStats.stats.luck,
        };
        const derivedStats = calculateDerivedStats(totalStats, equipmentStats, character.level);

        const updatedCharacter = await characterRepository.updateCharacter(character._id, {
            equipment: updatedEquipment,
            stats: totalStats,
            derivedStats: derivedStats
        });

        if (!updatedCharacter) throw new Error("Ошибка базы данных при обновлении персонажа");
        return updatedCharacter;
    },

    async addItemToInventory(userId: string, itemData: AddItemToInventory): Promise<Character> {
        const character = await characterRepository.findByUserId(userId);
        if (!character) throw new NotFoundError("Персонаж");
        if (!character._id) throw new Error("Отсутствует ID персонажа в базе данных");

        const emptySlotIndex = character.inventory.findIndex(item => !item.itemId);

        if (emptySlotIndex === -1) throw new InventoryFullError();

        const updatedInventory = [...character.inventory];
        updatedInventory[emptySlotIndex] = {
            itemId: itemData.itemId,
            quantity: itemData.quantity || 1
        }

        const updatedCharacter = await characterRepository.updateCharacter(character._id, {
            inventory: updatedInventory
        })

        if (!updatedCharacter) throw new Error("Ошибка базы данных при обновлении персонажа");
        return updatedCharacter
    }
}