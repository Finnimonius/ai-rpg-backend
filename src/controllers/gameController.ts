import { CreateGameDto } from '../dtos/game/CreateGameDto';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Response } from 'express';
import { gameService } from '../services/gameService';

export const gameController = {
    async createGame(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    message: 'Не авторизован'
                })
            }

            const createData: CreateGameDto = req.body;
            const game = await gameService.createGame(userId, createData);

            res.status(201).json({
                message: 'Игра создана',
                game: game
            })
        } catch (error) {
            return res.status(500).json({
                error: 'Внутренняя ошибка сервера'
            })
        }
    }
}