import { UserRole } from "../../types/role";


export interface CreateUserDto {
    nickName: string,
    email: string,
    password: string,
    confirmPassword?: string,
    role?: UserRole
}
