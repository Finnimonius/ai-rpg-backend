import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Response } from 'express';
import { eventService } from '../services/eventService';

export const eventController = {
    async openTreasure(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) { return res.status(401).json({ error: 'Не авторизован' }) }

        const game = await eventService.openTreasure(userId);

        res.status(200).json({
            message: 'Награда открыта',
            game: game
        })
    },

    async takeReward(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) { return res.status(401).json({ error: 'Не авторизован' }) }

        const game = await eventService.takeReward(userId);

        res.status(200).json({
            message: 'Награда получена',
            game: game
        })
    }
}