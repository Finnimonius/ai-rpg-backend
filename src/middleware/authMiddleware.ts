import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../services/jwtService';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if(!token) {
            return res.status(401).json({
                error: 'Токен не предоставлен'
            });
        }

        const userData = jwtService.verifyToken(token);

        (req as AuthenticatedRequest).user = userData;

        next()

    } catch (error) {
        console.error('Ошибка аутентификации:', error);
        
        return res.status(401).json({
            error: 'Неверный или просроченный токен'
        });
    }
}