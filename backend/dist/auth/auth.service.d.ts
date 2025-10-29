import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tokens } from 'src/types/types';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
export declare class AuthService {
    private readonly prisma;
    private readonly config;
    private readonly jwtService;
    constructor(prisma: PrismaService, config: ConfigService, jwtService: JwtService);
    register(registerDto: RegisterDto, response: Response): Promise<Response>;
    login(loginDto: LoginDto, response: Response): Promise<Response>;
    logout(username: string, response: Response): Promise<Response>;
    deleteUser(username: string, response: Response): Promise<Response>;
    hashData(data: string): Promise<string>;
    signTokens(userId: number, email: string): Promise<Tokens>;
    updateRtHash(userId: number, refresh_token: string): Promise<void>;
    setCookie(data: object, res: Response, req?: Request): Promise<void>;
    checkRefreshTokenValidity(refresh_token: string): Promise<boolean>;
    refresh(email: string, access_token: string, refresh_token: string, request: Request): Promise<Tokens>;
    checkRefreshToken(userid: number, refresh_token: string): Promise<void>;
}
