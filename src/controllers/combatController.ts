import { PerformActionDto } from '../dtos/combat/PerformActionDto';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Response } from 'express';

export const combatController = {
    async performAction(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });

        const combatData: PerformActionDto = req.body;


    },

    async flee(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });


        res.status(200).json({ message: 'Побег успешен' });
    }
}