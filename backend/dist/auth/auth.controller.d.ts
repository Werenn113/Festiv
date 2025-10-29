import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, response: Response): Promise<Response>;
    login(loginDto: LoginDto, response: Response): Promise<Response>;
    status(response: Response, request: Request): Response;
    logout(request: Request, response: Response): Promise<Response>;
    deleteUser(request: Request, response: Response): Promise<Response>;
}
