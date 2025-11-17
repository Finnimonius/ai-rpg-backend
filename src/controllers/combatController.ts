import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Response } from 'express';

export const combatController = {
    async createCombat(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Не авторизован' });

        
    }
}