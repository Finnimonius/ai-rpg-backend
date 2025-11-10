import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { CreateCharacterDto } from '../dtos/character/CreateCharacterDto';
import { characterService } from '../services/characterService';
import { EquipItemDto } from '../dtos/character/EquipItemDto';
import { UnequipItemDto } from '../dtos/character/UnequipItemDto';
import { MoveItemDto } from '../dtos/character/MoveItemDto';
import { SwapEquipmentDto } from '../dtos/character/SwapEquipmentDto';
import { AddItemToInventory } from '../dtos/character/AddItemToInventoryDto';

export const characterController = {
    async create(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;

        if (!userId) { return res.status(401).json({ error: 'Не авторизован' }) }

        const createData: CreateCharacterDto = req.body;
        const character = await characterService.createCharacter(userId, createData);

        res.status(201).json({
            message: 'Персонаж создан',
            character: character
        })
    },

    async get(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });

        const character = await characterService.getCharacter(userId);

        if (!character) {
            return res.status(404).json({ error: 'Персонаж не найден' });
        }

        res.status(200).json({ character });
    },

    async delete(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });

        const deleted = await characterService.deleteCharacter(userId);

        if (!deleted) {
            return res.status(404).json({ error: 'Персонаж не найден' });
        }

        res.status(200).json({
            message: 'Персонаж успешно удален',
            deleted: true
        });

    },

    async equip(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });

        const equipData: EquipItemDto = req.body;

        if (equipData.inventoryIndex === undefined || !equipData.equipmentSlot) {
            return res.status(400).json({ error: 'Неверные данные запроса' });
        }

        const character = await characterService.equipItem(userId, equipData);

        res.status(200).json({
            message: 'Предмет экипирован',
            character: character
        });

    },
    async unequip(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });

        const unequipData: UnequipItemDto = req.body;

        if (!unequipData.equipmentSlot || unequipData.inventoryIndex === undefined) {
            return res.status(400).json({ error: 'Неверные данные запроса' });
        }

        const character = await characterService.unequipItem(userId, unequipData);

        res.status(200).json({
            message: 'Предмет снят',
            character: character
        });
    },

    async moveInventory(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });

        const moveData: MoveItemDto = req.body;

        // Валидация
        if (moveData.fromIndex === undefined || moveData.toIndex === undefined) {
            return res.status(400).json({ error: 'Неверные данные запроса' });
        }

        const character = await characterService.moveInventoryItem(userId, moveData);

        res.status(200).json({
            message: 'Предмет перемещен',
            character: character
        });

    },

    async swapEquipment(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });

        const swapData: SwapEquipmentDto = req.body;

        if (!swapData.fromSlot || !swapData.toSlot) {
            return res.status(400).json({ error: 'Неверные данные запроса' });
        }

        const character = await characterService.swapEquipmentItem(userId, swapData);

        res.status(200).json({
            message: 'Экипировка изменена',
            character: character
        });
    },

    async addItemToInventory(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });

        const itemData: AddItemToInventory = req.body;

        if (!itemData.itemId || !itemData.quantity) {
            return res.status(400).json({ error: 'Неверные данные запроса' });
        }

        const character = await characterService.addItemToInventory(userId, itemData);

        res.status(200).json({
            message: 'Предмет добавлен в инвентарь',
            character: character
        })
    }
}