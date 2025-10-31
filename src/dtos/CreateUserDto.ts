export interface CreateUserDto {
    nickName: string,
    email: string,
    password: string,
    confirmPassword?: string,
}
