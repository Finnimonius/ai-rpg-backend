import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { CreateUserDto } from '../dtos/CreateUserDto';

export const userController = {
    async register(req: Request, res: Response) {
        try {
            // 1. Получить данные из тела запроса
            const userData: CreateUserDto = req.body;

            // Валидация обязательных полей
            if (!userData.email || !userData.password || !userData.nickName) {
                return res.status(400).json({
                    error: 'Все поля обязательны для заполнения'
                })
            }

            const user = await userService.register(userData);

            res.status(201).json({
                message: 'Пользователь успешно зарегестрирован',
                user: user
            })

        } catch (error) {
            console.error('Ошибка регистрации', error);

            if (error instanceof Error) {
                if (error.message.includes('уже существует')) {
                    return res.status(409).json({
                        error: error.message
                    })
                }
            }

            res.status(500).json({
                error: 'Внутренняя ошибка сервера'
            })
        }
    },

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email и пароль обязательны'
                })
            }

            const user = await userService.login(email, password);

            res.status(200).json({
                message: 'Авторизация прошла успешно',
                user: user,
            })
        } catch (error) {
            console.error('Ошибка авторизации', error)

            if (error instanceof Error) {
                if (error.message.includes('Неверный пароль')) {
                    return res.status(401).json({
                        error: error.message
                    })
                } else if (error.message.includes('не найден')) {
                    return res.status(404).json({
                        error: error.message
                    })
                }
            }

            return res.status(500).json({
                error: 'Внутренняя ошибка сервера'
            });
        }
    }
}