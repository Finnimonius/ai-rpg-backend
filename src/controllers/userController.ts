import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { CreateUserDto } from '../dtos/user/CreateUserDto';
import { userRepository } from '../repositories/userRepository';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { UpdateProfileDto } from '../dtos/user/UpdateProfileDto';
import { ChangePasswordDto } from '../dtos/user/ChangePasswordDto';

export const userController = {
    async register(req: Request, res: Response) {
        const userData: CreateUserDto = req.body;

        const user = await userService.register(userData);

        res.status(201).json({
            message: 'Пользователь успешно зарегестрирован',
            user: user
        })
    },

    async login(req: Request, res: Response) {
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
    },

    async logout(req: Request, res: Response) {
        res.clearCookie('token');
        res.status(200).json({
            message: 'Выход выполнен успешно'
        })
    },

    async getProfile(req: AuthenticatedRequest, res: Response) {

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
    },

    async updateProfile(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                error: 'Пользователь не авторизован'
            })
        }
        const updateData: UpdateProfileDto = req.body;

        const user = await userService.updateProfile(userId, updateData)

        res.status(200).json({
            message: 'Профиль успешно обновлён',
            user: user
        })
    },

    async changePassword(req: AuthenticatedRequest, res: Response) {
        const userId = req.user?.userId

        if (!userId) {
            return res.status(401).json({
                error: 'Пользователь не авторизован'
            })
        }
        const updateData: ChangePasswordDto = req.body;
        await userService.changePassword(userId, updateData)

        res.status(200).json({
            message: 'Пароль успешно изменен'
        })
    }
}