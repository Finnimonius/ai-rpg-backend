import { CreateGameDto } from '../dtos/game/CreateGameDto';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Response } from 'express';
import { gameService } from '../services/gameService';

export const gameController = {
    async createGame(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) return res.status(401).json({ error: 'Не авторизован' });

            const createData: CreateGameDto = req.body;
            const game = await gameService.createGame(userId, createData);

            res.status(201).json({
                message: 'Игра создана',
                game: game
            })
        } catch (error) {
            console.error('Ошибка создания игры:', error);

            if (error instanceof Error) {
                if (error.message.includes('Не авторизован')) {
                    return res.status(401).json({ error: error.message });
                }
                if (error.message.includes('не найдено')) {
                    return res.status(404).json({ error: error.message });
                }
            }
            return res.status(500).json({
                error: 'Внутренняя ошибка сервера'
            })
        }
    },

    async getGame(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.userId;
            if (!userId) return res.status(401).json({ error: 'Не авторизован' });

            const game = await gameService.getGame(userId);
            if (!game) return res.status(404).json({ error: 'Игра не найдена' });

            res.status(200).json({ game })
        } catch (error) {
            console.error('Ошибка получения игры:', error);

            if (error instanceof Error) {
                if (error.message.includes('Не авторизован')) {
                    return res.status(401).json({ error: error.message });
                }
                if (error.message.includes('не найдена')) {
                    return res.status(404).json({ error: error.message });
                }
            }
            return res.status(500).json({
                error: 'Внутренняя ошибка сервера'
            });
        }
    }
}