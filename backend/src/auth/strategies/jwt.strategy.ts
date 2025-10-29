import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '../auth.service'
import * as jwt from 'jsonwebtoken'
import { jwtType, Tokens } from 'src/types/types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly config: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET'),
            passReqToCallback: true, // allow to access http request from within this class
            ignoreExpiration: true, // ignoring token expiration, meaning the token will be considered valid even if expired
        })
    }

    async validate(request: Request, payload: jwtType) {
        const refresh_token: string = JwtStrategy.extractRefreshTokenfromCookie(request)

        const accessTokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken()
        const access_token: string = accessTokenExtractor(request)

        try {
            const tokens: Tokens = await this.refreshIfNeeded(access_token, refresh_token, request)
            request.headers['authorization'] = tokens?.access_token
        } catch (error) {
            console.error(error)
            return false
        }
        return payload
    }

    private static extractRefreshTokenfromCookie(request: Request): string | null {

        const cookie = request.cookies['AuthCookie']
        if (!cookie) {
            return null
        }

        try {
            const authData = JSON.parse(cookie)
            if (authData && 'refresh_token' in authData) {
                return authData.refresh_token
            }
        } catch (error) {
            console.error('Error parsing AuthCookie:', error)
        }

        return null
    }


    // check if the access_token is valid and not expired
    private async refreshIfNeeded(access_token: string, refresh_token: string, request: Request) {

        if (!access_token) {
            throw new Error(`Forbidden. No access token found.`)
        }

        // Check if the access token is expired
        if (this.isTokenExpired(access_token)) {

            console.log("Access token is expired, refreshing...")

            if (!refresh_token) {
                throw new Error(`Forbidden. No refresh token found.`)
            }

            if (this.isTokenExpired(refresh_token)) {
                throw new Error(`Forbidden. Refresh token is expired too. Please log in again.`)
            }

            const decodedToken = jwt.decode(access_token, { complete: true }) as { [key: string]: any }
            const email = decodedToken.payload.email
            const new_tokens = await this.authService.refresh(email, access_token, refresh_token, request)
            return new_tokens
        }
        console.log("Access token is still valid")
        return null
    }

    private isTokenExpired(token: string): boolean {
        const decodedToken = jwt.decode(token, { complete: true }) as { [key: string]: any }
        const now = Date.now() / 1000 // Current timestamp in seconds
        const expirationDate = decodedToken.payload.exp
        return decodedToken && expirationDate && expirationDate < now
    }
}