import { CreateUserDto } from "../dtos/CreateUserDto";
import { User } from "../models/User";
import { userRepository } from "../repositories/userRepository";
import bcrypt from 'bcrypt';
import { jwtService } from "./jwtService";
import { UpdateProfileDto } from "../dtos/UpdateProfileDto";
import { ChangePasswordDto } from "../dtos/ChangePasswordDto";
import { UserRole } from "../types/role";
import { NotFoundError, ValidationError, ConflictError, UnauthorizedError } from '../errors/AppError';

export const userService = {
    async register(userData: CreateUserDto): Promise<Omit<User, 'password'>> {
        const existingUser = await userRepository.findByEmail(userData.email);

        if (existingUser) {
            throw new ConflictError("Пользователь с таким email уже существует");
        }

        const { confirmPassword, ...userDataForDb } = userData;

        const saltRounds = 10; // Сложность хеширования
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

        const user = await userRepository.createUser({
            nickName: userData.nickName,
            email: userData.email,
            password: hashedPassword,
            role: UserRole.USER,
        });

        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword
    },

    async login(email: string, password: string): Promise<{
        user: Omit<User, 'password'>;
        token: string;
    }> {
        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new UnauthorizedError("Пользователь с таким email не найден");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throw new UnauthorizedError("Неверный пароль");
        }

        const { password: _, ...userWithoutPassword } = user;

        const token = jwtService.generateToken({
            userId: user._id!.toString(),
            email: user.email
        })

        return {
            user: userWithoutPassword,
            token: token
        };
    },

    async updateProfile(userId: string, updatedData: UpdateProfileDto): Promise<Omit<User, 'password'>> {
        if (updatedData.email) {
            const existingUser = await userRepository.findByEmail(updatedData.email);

            if (existingUser && existingUser._id?.toString() !== userId) {
                throw new ConflictError("Пользователь с таким email уже существует");
            }
        }

        const user = await userRepository.updateUser(userId, updatedData);

        if (!user) {
            throw new NotFoundError("Пользователь");
        }

        const { password: _, ...userWithoutPassword } = user;

        return userWithoutPassword
    },

    async changePassword(userId: string, passwordData: ChangePasswordDto): Promise<void> {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new NotFoundError("Пользователь");
        }

        const isOldPassword = await bcrypt.compare(passwordData.oldPassword, user.password);
        if (!isOldPassword) {
            throw new ValidationError('Неверный текущий пароль')
        }

        const isSamePassword = await bcrypt.compare(passwordData.newPassword, user.password);
        if (isSamePassword) {
            throw new ValidationError("Новый пароль должен отличаться от старого");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passwordData.newPassword, saltRounds);

        await userRepository.updatePassword(userId, hashedPassword);
    }
}