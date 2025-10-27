import { CreateUserDto } from "../dtos/CreateUserDto";
import { User } from "../models/User";
import { userRepository } from "../repositories/userRepository";

export const userService = {
    async register(userData: CreateUserDto): Promise<Omit<User, 'password'>> {
        const existingUser = await userRepository.findByEmail(userData.email);

        if (existingUser) {
            throw new Error("Пользователь с таким email уже существует");
        }

        const hashedPassword = userData.password; // Заменить на хэширование

        const user = await userRepository.createUser({
            nickName: userData.nickName,
            email: userData.email,
            password: hashedPassword
        });

        const { password, ...userWithoutPassword } = user;

        return userWithoutPassword
    }
}