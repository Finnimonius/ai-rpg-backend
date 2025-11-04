import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { CreateCharacterDto } from '../dtos/CreateCharacterDto';
import { characterService } from '../services/characterService';
import { EquipItemDto } from '../dtos/EquipItemDto';

export const characterController = {
    async create(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    error: 'Не авторизован'
                })
            }

            const createData: CreateCharacterDto = req.body;
            const character = await characterService.createCharacter(userId, createData);

            res.status(201).json({
                message: 'Персонаж создан',
                character: character
            })
        } catch (error) {
            return res.status(500).json({
                error: 'Внутренняя ошибка сервера'
            });
        }
    },

    async get(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) return res.status(401).json({ error: 'Не авторизован' });

            const character = await characterService.getCharacter(userId);

            if (!character) {
                return res.status(404).json({ error: 'Персонаж не найден' });
            }

            res.status(200).json({ character });
        } catch (error) {
            return res.status(500).json({
                error: 'Внутренняя ошибка сервера'
            });
        }
    },

    async equip(req: AuthenticatedRequest, res: Response) {
        try {
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
        } catch (error) {
            console.error('Ошибка экипировки:', error);

            if (error instanceof Error) {
                if (error.message.includes('Не авторизован')) {
                    return res.status(401).json({ error: error.message });
                }
                if (error.message.includes('не найден')) {
                    return res.status(404).json({ error: error.message });
                }
                if (error.message.includes('Нельзя экипировать') ||
                    error.message.includes('Нет свободного места')) {
                    return res.status(400).json({ error: error.message });
                }
            }

            return res.status(500).json(
                { error: 'Внутренняя ошибка сервера' }
            );
        }
    }
}