import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { userRepository } from '../repositories/userRepository';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const userController = {
    async register(req: Request, res: Response) {
        try {
            // 1. Получить данные из тела запроса
            const userData: CreateUserDto = req.body;

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
            const { user, token } = await userService.login(email, password);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

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
    },

    async logout(req: Request, res: Response) {
        res.clearCookie('token');
        res.status(200).json({
            message: 'Выход выполнен успешно'
        })
    },

    async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({
                    error: 'Пользователь не авторизован'
                })
            }

            const user = await userRepository.findById(userId);

            if (!user) {
                return res.status(404).json({
                    error: 'Пользователь не найден'
                })
            }

            const { password, ...userWithoutPassword } = user;

            res.status(200).json({
                user: userWithoutPassword
            })
        } catch (error) {
            console.error('Ошибка получения профиля:', error);
            return res.status(500).json({
                error: 'Внутренняя ошибка сервера'
            });
        }
    }
}