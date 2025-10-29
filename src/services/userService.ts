import { CreateUserDto } from "../dtos/CreateUserDto";
import { User } from "../models/User";
import { userRepository } from "../repositories/userRepository";
import bcrypt from 'bcrypt';
import { jwtService } from "./jwtService";

export const userService = {
    async register(userData: CreateUserDto): Promise<Omit<User, 'password'>> {
        const existingUser = await userRepository.findByEmail(userData.email);

        if (existingUser) {
            throw new Error("Пользователь с таким email уже существует");
        }

        const { confirmPassword, ...userDataForDb } = userData;

        const saltRounds = 10; // Сложность хеширования
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

        const user = await userRepository.createUser({
            nickName: userData.nickName,
            email: userData.email,
            password: hashedPassword,
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
            throw new Error("Пользователь с таким email не найден");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throw new Error("Неверный пароль");
        }

        const { password: _, ...userWithoutPassword } = user;

        const token = jwtService.generateToken({
            userId: user._id!,
            email: user.email
        })

        return {
            user: userWithoutPassword,
            token: token
        };
    }
}