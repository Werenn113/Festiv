"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../auth.service");
const jwt = require("jsonwebtoken");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(config, authService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('ACCESS_TOKEN_SECRET'),
            passReqToCallback: true,
            ignoreExpiration: true,
        });
        this.config = config;
        this.authService = authService;
    }
    async validate(request, payload) {
        const refresh_token = JwtStrategy_1.extractRefreshTokenfromCookie(request);
        const accessTokenExtractor = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken();
        const access_token = accessTokenExtractor(request);
        try {
            const tokens = await this.refreshIfNeeded(access_token, refresh_token, request);
            request.headers['authorization'] = tokens?.access_token;
        }
        catch (error) {
            console.error(error);
            return false;
        }
        return payload;
    }
    static extractRefreshTokenfromCookie(request) {
        const cookie = request.cookies['AuthCookie'];
        if (!cookie) {
            return null;
        }
        try {
            const authData = JSON.parse(cookie);
            if (authData && 'refresh_token' in authData) {
                return authData.refresh_token;
            }
        }
        catch (error) {
            console.error('Error parsing AuthCookie:', error);
        }
        return null;
    }
    async refreshIfNeeded(access_token, refresh_token, request) {
        if (!access_token) {
            throw new Error(`Forbidden. No access token found.`);
        }
        if (this.isTokenExpired(access_token)) {
            console.log("Access token is expired, refreshing...");
            if (!refresh_token) {
                throw new Error(`Forbidden. No refresh token found.`);
            }
            if (this.isTokenExpired(refresh_token)) {
                throw new Error(`Forbidden. Refresh token is expired too. Please log in again.`);
            }
            const decodedToken = jwt.decode(access_token, { complete: true });
            const email = decodedToken.payload.email;
            const new_tokens = await this.authService.refresh(email, access_token, refresh_token, request);
            return new_tokens;
        }
        console.log("Access token is still valid");
        return null;
    }
    isTokenExpired(token) {
        const decodedToken = jwt.decode(token, { complete: true });
        const now = Date.now() / 1000;
        const expirationDate = decodedToken.payload.exp;
        return decodedToken && expirationDate && expirationDate < now;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map