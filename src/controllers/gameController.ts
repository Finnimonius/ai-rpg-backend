import { CreateGameDto } from '../dtos/game/CreateGameDto';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Response } from 'express';
import { gameService } from '../services/gameService';
import { MoveToLocationDto } from '../dtos/game/MoveToLocationDto';

export const gameController = {
    async createGame(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });

        const createData: CreateGameDto = req.body;
        const game = await gameService.createGame(userId, createData);

        res.status(201).json({
            message: 'Игра создана',
            game: game
        })
    },

    async getGame(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });

        const game = await gameService.getGame(userId);
        if (!game) return res.status(404).json({ error: 'Игра не найдена' });

        res.status(200).json({ game })
    },

    async deleteGame(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });

        const deleted = await gameService.deleteGame(userId);
        if (!deleted) return res.status(404).json({ error: 'Игра не найдена' });

        res.status(200).json({
            message: 'Игра успешно удалена',
            deleted: true
        });
    },

    async moveToLocation(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });

        const moveData: MoveToLocationDto = req.body;

        const game = await gameService.moveToLocation(userId, moveData);
        if (!game) return res.status(404).json({ error: 'Игра не найдена' });

        res.status(200).json({
            message: 'Успешный переход в локацию',
            game: game
        });
    }
}