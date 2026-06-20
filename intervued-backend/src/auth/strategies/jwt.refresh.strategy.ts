import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Refresh-Token-Strategie - prüft den Refresh Token
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_REFRESH_SECRET')!,
            // Request weitergeben um den Token aus dem Header zu lesen
            passReqToCallback: true,
        });
    }

    // Refresh Token aus dem Header extrahieren und weitergeben
    async validate(req: Request, payload: { sub: string; email: string }) {
        const refreshToken = req.get('Authorization')?.replace('Bearer ', '').trim();
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh Token fehlt');
        }
        return { userId: payload.sub, email: payload.email, refreshToken };
    }
}