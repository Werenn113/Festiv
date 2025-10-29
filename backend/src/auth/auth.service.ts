import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Tokens, UserType } from 'src/types/types';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { Request, response, Response } from 'express';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
        private readonly jwtService: JwtService
    ) { }

    /**
     * Gère la logique de l'inscription
     * @param registerDto les données utilisateur
     * @param response la réponse
     * @returns une réponse avec le username et l'email, le refresh token est défini dans le cookie (avec username et email) et l'access token est défini dans le header authorization 
     */
    async register(registerDto: RegisterDto, response: Response): Promise<Response> {
        const usernameTaken: UserType = await this.prisma.users.findUnique({ where: { username: registerDto.username } })
        if (usernameTaken) throw new ConflictException("Username is taken")

        const emailTaken: UserType = await this.prisma.users.findUnique({ where: { email: registerDto.email } })
        if (emailTaken) throw new ConflictException("Email is taken")

        const hashedPassword: string = await this.hashData(registerDto.password)

        const newUser: UserType = await this.prisma.users.create({
            data: {
                username: registerDto.username,
                email: registerDto.email,
                hashedPwd: hashedPassword
            }
        })

        const tokens: Tokens = await this.signTokens(newUser.id, newUser.email)
        await this.updateRtHash(newUser.id, tokens.refresh_token)

        this.setCookie({
            username: registerDto.username,
            email: registerDto.email,
            refresh_token: tokens.refresh_token
        }, response)

        return response.status(200).json({
            username: newUser.username,
            email: newUser.email,
            access_token: tokens.access_token
        })
    }

    /**
     * Gère la logique de connection
     * @param loginDto les données utilisateur
     * @param response la réponse
     * @returns une réponse avec le username et l'email, le refresh token est défini dans le cookie (avec username et email) et l'access token est défini dans le header authorization
     */
    async login(loginDto: LoginDto, response: Response): Promise<Response> {
        const user: UserType = await this.prisma.users.findUnique({ where: { email: loginDto.email } })
        if (!user) throw new NotFoundException("User not found")

        const passwordMatches: Boolean = await bcrypt.compare(loginDto.password, user.hashedPwd)
        if (!passwordMatches) throw new ForbiddenException("Access Denied")

        const tokens: Tokens = await this.signTokens(user.id, user.email)
        await this.updateRtHash(user.id, tokens.refresh_token)

        this.setCookie({
            username: user.username,
            email: user.email,
            refresh_token: tokens.refresh_token
        }, response)

        return response.status(200).json({
            username: user.username,
            email: user.email,
            access_token: tokens.access_token
        })
    }

    /**
     * Gère la logique de déconnection
     * @param username le username de l'utilisateur
     * @param response la réponse
     * @returns code 200 si l'utilisateur a été déconnecté
     */
    async logout(username: string, response: Response): Promise<Response> {
        await this.prisma.users.updateMany({
            where: {
                username: username,
                hashedRt: {
                    not: null
                }
            },
            data: {
                hashedRt: null
            }
        })
        response.clearCookie("Authcookie")
        return response.status(200).send("User disconnected")
    }

    /**
     * Gère la logique de la suppréssion d'un utilisateur
     * @param username le username de l'utilisateur
     * @param response la réponse
     * @returns code 200 si l'utilisateur a été supprimé
     */
    async deleteUser(username: string, response: Response): Promise<Response> {
        await this.prisma.users.deleteMany({
            where: {
                username: username,
            }
        })
        response.clearCookie("Authcookie")
        return response.status(200).send("User deleted")
    }

    /**
     * Pour hasher quelque chose
     * @param data les donnés à hasher
     * @returns les donnés hashées
     */
    hashData(data: string): Promise<string> {
        return bcrypt.hash(data, 10)
    }

    /**
     * Pour créer les tokens
     * @param userId l'id de l'utilisateur
     * @param email l'email de l'utilisateur
     * @returns les tokens crées
     */
    async signTokens(userId: number, email: string): Promise<Tokens> {
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email,
            }, {
                secret: this.config.get('ACCESS_TOKEN_SECRET'),
                expiresIn: 60 * 15 // 15 min
            }),

            this.jwtService.signAsync({
                sub: userId,
                email,
            }, {
                secret: this.config.get('REFRESH_TOKEN_SECRET'),
                expiresIn: 60 * 60 * 24 * 7 // 1 semaine
            })
        ])
        return {
            access_token: access_token,
            refresh_token: refresh_token
        }
    }

    /**
     * Pour rafraichir le refresh token dans la base de données
     * @param userId l'id de l'utilisateur
     * @param refresh_token le refresh token
     */
    async updateRtHash(userId: number, refresh_token: string): Promise<void> {
        const hash: string = await this.hashData(refresh_token)
        await this.prisma.users.update({
            where: {
                id: userId
            },
            data: {
                hashedRt: hash
            }
        })
    }

    /**
     * Pour créer le cookie
     * @param data les données à evoyer
     * @param response la réponse
     */
    async setCookie(data: object, res: Response, req?: Request) {

        let domain = ""
        if (req) {
            let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
            const parsedUrl = new URL(fullUrl)
            domain = parsedUrl.hostname
            if (domain !== "localhost")
                throw new UnauthorizedException("Vous venez de contrées trop lointaines")
        }

        const serializeData = JSON.stringify(data)


        res.cookie('AuthCookie', serializeData, {
            sameSite: 'lax',
            httpOnly: true, // not available for javascript
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, // one day
            path: '/',
        })
    }

    /**
     * Pour vérifier la validité du refresh token
     * @param refresh_token le refresh token
     * @returns true si le refresh token est valide, false sinon
     */
    async checkRefreshTokenValidity(refresh_token: string): Promise<boolean> {
        if (refresh_token === null || refresh_token === undefined) {
            return false
        }

        jwt.verify(refresh_token, this.config.get("REFRESH_TOKEN_SECRET") as string, (err, decoded) => {
            if (err) {
                throw new UnauthorizedException('Invalid refresh token')
            } else {
                return true
            }
        })
    }

    /**
     * Gère la logique de rafraichissement du refresh token
     * @param email l'email de l'utilisateur
     * @param refresh_token le refresh token à rafraichir
     * @param response la reponse
     * @returns les tokens, le refresh token est défini dans le cookie (avec username et email) et l'access token est défini dans le header authorization
     */
    async refresh(email: string, access_token: string, refresh_token: string, request: Request): Promise<Tokens> {

        // check if refresh token is valid using the secret in the .env file
        try {
            await this.checkRefreshTokenValidity(refresh_token)
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token')
        }

        const user = await this.prisma.users.findUnique({
            where: { email: email },
            select: {
                id: true,
                email: true
            }
        })

        if (!user) throw new ForbiddenException(`Access denied.User ${email} was not found in the db`)

        // check if the access token and the refresh tokens match the ones
        // previously registered in the db
        await this.checkRefreshToken(user.id, refresh_token)

        // issue new tokens
        const tokens: Tokens = await this.signTokens(user.id, user.email)

        // register new refresh token in the db
        await this.updateRtHash(user.id, tokens.refresh_token)

        // update access token in cookie :
        await this.setCookie({ refresh_token }, request.res, request)

        // return the tokens
        return {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        } //pas necessaire de renvoyé le RT
    }

    async checkRefreshToken(userid: number, refresh_token: string) {
        try {

            // get user hash from his id
            const user = await this.prisma.users.findUnique({
                where: { id: userid },
            })

            if (!user) throw new ForbiddenException(`User with id ${userid} is not in hash table.`)

            const rthash: string | null = user.hashedRt
            if (!rthash)
                throw new ForbiddenException(`User ${userid} has no refresh token.`)

            // check if refresh token hash correspond to the hashed version from the db
            const rtMatches = await bcrypt.compare(refresh_token, rthash)
            if (rtMatches === false) {
                throw new UnauthorizedException(`Access denied. Refresh token does not match the one in the db.`)
            }

        } catch (error) {
            throw error
        }
    }
}
