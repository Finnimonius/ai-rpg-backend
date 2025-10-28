import { CreateUserDto } from "../dtos/CreateUserDto";
import { User } from "../models/User";
import { userRepository } from "../repositories/userRepository";
import bcrypt from 'bcrypt';

export const userService = {
    async register(userData: CreateUserDto): Promise<Omit<User, 'password'>> {
        const existingUser = await userRepository.findByEmail(userData.email);

        if (existingUser) {
            throw new Error("Пользователь с таким email уже существует");
        }

        const saltRounds = 10; // Сложность хеширования
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

        const user = await userRepository.createUser({
            nickName: userData.nickName,
            email: userData.email,
            password: hashedPassword
        });

        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword
    },

    async login(email: string, password: string): Promise<Omit<User, 'password'>>{
        const user = await userRepository.findByEmail(email);

        if(!user) {
            throw new Error("Пользователь с таким email уже существует");
        }

        const isPasswordValid = bcrypt.compare(password, user.password)

        if(!isPasswordValid) {
            throw new Error("Неверный пароль");
        }

        const { password: _, ...userWithoutPassword } = user;

        return userWithoutPassword
    }
}