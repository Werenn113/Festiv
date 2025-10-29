import { LoginDto } from "src/auth/dto/login.dto"

export type Tokens = {
    access_token: string,
    refresh_token: string
}

export type AuthData = {
    username: string,
    email: string,
    refresh_token: string
}

export type UserType = {
    id?: number,
    createdAt?: Date,
    updatedAt?: Date,
    username?: string,
    email?: string,
    hashedPwd?: string,
    hashedRt?: string
}

export type jwtType = {
    sub: LoginDto,
    iat: number,
    exp: number,
}