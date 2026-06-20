import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// JWT-Strategie - prüft den Access Token bei geschützten Routen
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            // Token aus dem Authorization Header extrahieren
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Abgelaufene Tokens ablehnen
            ignoreExpiration: false,
            // Geheimschlüssel zum Validieren
            secretOrKey: configService.get('JWT_SECRET')!,
        });
    }

    // Wird nach erfolgreicher Token-Validierung aufgerufen
    async validate(payload: { sub: string; email: string }) {
        return { userId: payload.sub, email: payload.email };
    }
}