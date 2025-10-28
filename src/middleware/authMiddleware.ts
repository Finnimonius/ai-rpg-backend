import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../services/jwtService';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({
                error: 'Токен не предоставлен'
            });
        }

        const [bearer, token] = authHeader.split(' ');

        if(bearer !== 'Bearer' || !token) {
            return res.status(401).json({
                error: 'Неверный формат'
            })
        }

        const userData = jwtService.verifyToken(token);

        req.user = userData;

        next()

    } catch (error) {
        console.error('Ошибка аутентификации:', error);
        
        return res.status(401).json({
            error: 'Неверный или просроченный токен'
        });
    }
}