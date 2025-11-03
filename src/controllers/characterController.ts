import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { CreateCharacterDto } from '../dtos/CreateCharacterDto';
import { characterService } from '../services/characterService';

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
    }
}