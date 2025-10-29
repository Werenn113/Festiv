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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt = require("jsonwebtoken");
let AuthService = class AuthService {
    constructor(prisma, config, jwtService) {
        this.prisma = prisma;
        this.config = config;
        this.jwtService = jwtService;
    }
    async register(registerDto, response) {
        const usernameTaken = await this.prisma.users.findUnique({ where: { username: registerDto.username } });
        if (usernameTaken)
            throw new common_1.ConflictException("Username is taken");
        const emailTaken = await this.prisma.users.findUnique({ where: { email: registerDto.email } });
        if (emailTaken)
            throw new common_1.ConflictException("Email is taken");
        const hashedPassword = await this.hashData(registerDto.password);
        const newUser = await this.prisma.users.create({
            data: {
                username: registerDto.username,
                email: registerDto.email,
                hashedPwd: hashedPassword
            }
        });
        const tokens = await this.signTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);
        this.setCookie({
            username: registerDto.username,
            email: registerDto.email,
            refresh_token: tokens.refresh_token
        }, response);
        return response.status(200).json({
            username: newUser.username,
            email: newUser.email,
            access_token: tokens.access_token
        });
    }
    async login(loginDto, response) {
        const user = await this.prisma.users.findUnique({ where: { email: loginDto.email } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const passwordMatches = await bcrypt.compare(loginDto.password, user.hashedPwd);
        if (!passwordMatches)
            throw new common_1.ForbiddenException("Access Denied");
        const tokens = await this.signTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        this.setCookie({
            username: user.username,
            email: user.email,
            refresh_token: tokens.refresh_token
        }, response);
        return response.status(200).json({
            username: user.username,
            email: user.email,
            access_token: tokens.access_token
        });
    }
    async logout(username, response) {
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
        });
        response.clearCookie("Authcookie");
        return response.status(200).send("User disconnected");
    }
    async deleteUser(username, response) {
        await this.prisma.users.deleteMany({
            where: {
                username: username,
            }
        });
        response.clearCookie("Authcookie");
        return response.status(200).send("User deleted");
    }
    hashData(data) {
        return bcrypt.hash(data, 10);
    }
    async signTokens(userId, email) {
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email,
            }, {
                secret: this.config.get('ACCESS_TOKEN_SECRET'),
                expiresIn: 60 * 15
            }),
            this.jwtService.signAsync({
                sub: userId,
                email,
            }, {
                secret: this.config.get('REFRESH_TOKEN_SECRET'),
                expiresIn: 60 * 60 * 24 * 7
            })
        ]);
        return {
            access_token: access_token,
            refresh_token: refresh_token
        };
    }
    async updateRtHash(userId, refresh_token) {
        const hash = await this.hashData(refresh_token);
        await this.prisma.users.update({
            where: {
                id: userId
            },
            data: {
                hashedRt: hash
            }
        });
    }
    async setCookie(data, res, req) {
        let domain = "";
        if (req) {
            let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            const parsedUrl = new URL(fullUrl);
            domain = parsedUrl.hostname;
            if (domain !== "localhost")
                throw new common_1.UnauthorizedException("Vous venez de contrées trop lointaines");
        }
        const serializeData = JSON.stringify(data);
        res.cookie('AuthCookie', serializeData, {
            sameSite: 'lax',
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
        });
    }
    async checkRefreshTokenValidity(refresh_token) {
        if (refresh_token === null || refresh_token === undefined) {
            return false;
        }
        jwt.verify(refresh_token, this.config.get("REFRESH_TOKEN_SECRET"), (err, decoded) => {
            if (err) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            else {
                return true;
            }
        });
    }
    async refresh(email, access_token, refresh_token, request) {
        try {
            await this.checkRefreshTokenValidity(refresh_token);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.prisma.users.findUnique({
            where: { email: email },
            select: {
                id: true,
                email: true
            }
        });
        if (!user)
            throw new common_1.ForbiddenException(`Access denied.User ${email} was not found in the db`);
        await this.checkRefreshToken(user.id, refresh_token);
        const tokens = await this.signTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        await this.setCookie({ refresh_token }, request.res, request);
        return {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        };
    }
    async checkRefreshToken(userid, refresh_token) {
        try {
            const user = await this.prisma.users.findUnique({
                where: { id: userid },
            });
            if (!user)
                throw new common_1.ForbiddenException(`User with id ${userid} is not in hash table.`);
            const rthash = user.hashedRt;
            if (!rthash)
                throw new common_1.ForbiddenException(`User ${userid} has no refresh token.`);
            const rtMatches = await bcrypt.compare(refresh_token, rthash);
            if (rtMatches === false) {
                throw new common_1.UnauthorizedException(`Access denied. Refresh token does not match the one in the db.`);
            }
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map