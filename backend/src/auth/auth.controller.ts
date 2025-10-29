import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { JwtGuard } from './guards/jwt.gards';
import { addAccessTokenToResponse } from 'src/utils/addAccessTokenToResponse';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Pour créer un nouveau compte dans la bdd
     * @param registerDto les données utilisateur
     * @param response la réponse
     * @returns une réponse avec le refresh token et l'access token dans le cookie (username et email sont aussi envoyé)
     */
    @Post("register")
    register(@Body() registerDto: RegisterDto, @Res() response: Response): Promise<Response> {
        return this.authService.register(registerDto, response)
    }

    /**
     * Pour se connecter
     * @param loginDto les données utilisateur
     * @param response la réponse
     * @returns une réponse avec le refresh token et l'access token dans le cookie (username et email sont aussi envoyé)
     */
    @Post("login")
    login(@Body() loginDto: LoginDto, @Res() response: Response): Promise<Response> {
        return this.authService.login(loginDto, response)
    }

    /**
     * Pour vérifier qu'un utilisateur est bien connecté avec les bons credentials
     * @param response la réponse
     * @returns une réponse avec le code 200 si les credentials sont bon
     */
    @Get('status')
	@UseGuards(JwtGuard)
	status(@Res() response: Response, @Req() request: Request): Response {
        return addAccessTokenToResponse(request, response, true)
	}

    /**
     * Pour se déconnecter
     * @param request la requette reçu
     * @param response la réponse
     * @returns code 200 si l'utilisateur a été déconnecté
     */
    @Post("logout")
    @UseGuards(JwtGuard)
    logout(@Req() request: Request, @Res() response: Response): Promise<Response> {
        const user = JSON.parse(request.cookies.AuthCookie)
        return this.authService.logout(user.username, response)
    }

    /**
     * Pour supprimer un utilisateur de la bdd
     * @param request la requette reçu
     * @param response la réponse
     * @returns code 200 si l'utilisateur a été supprimé
     */
    @Post("delete-user")
    @UseGuards(JwtGuard)
    deleteUser(@Req() request: Request, @Res() response: Response): Promise<Response> {
        const user = JSON.parse(request.cookies.AuthCookie)
        return this.authService.deleteUser(user.username, response)
    }
}
