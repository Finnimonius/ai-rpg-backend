import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction){
    console.error('Ошибка', error);

    if(error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: error.publicMessage || error.message
        })
    }

    return res.status(500).json({
        error: 'Внутренняя ошибка сервера'
    });
}