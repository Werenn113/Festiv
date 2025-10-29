import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { jwtType } from 'src/types/types';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly config;
    private readonly authService;
    constructor(config: ConfigService, authService: AuthService);
    validate(request: Request, payload: jwtType): Promise<false | jwtType>;
    private static extractRefreshTokenfromCookie;
    private refreshIfNeeded;
    private isTokenExpired;
}
export {};
