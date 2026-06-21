import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Authentifizierungsservice - verwaltet alle Auth-Operationen
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    // Neuen Benutzer registrieren
    async register(registerDto: RegisterDto) {
        // Prüfen ob E-Mail bereits existiert
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('E-Mail-Adresse wird bereits verwendet');
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Benutzer erstellen
        const user = await this.usersService.create(
            registerDto.email,
            registerDto.name,
            hashedPassword,
        );

        // Tokens generieren
        const tokens = await this.generateTokens(user.id, user.email);
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        return {
            user: { id: user.id, email: user.email, name: user.name },
            ...tokens,
        };
    }

    // Benutzer anmelden
    async login(loginDto: LoginDto) {
        // Benutzer anhand der E-Mail suchen
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Ungültige Anmeldedaten');
        }

        // Passwort überprüfen
        const passwordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Ungültige Anmeldedaten');
        }

        // Tokens generieren und Refresh Token speichern
        const tokens = await this.generateTokens(user.id, user.email);
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        return {
            user: { id: user.id, email: user.email, name: user.name },
            ...tokens,
        };
    }

    // Refresh Token erneuern
    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Zugriff verweigert');
        }

        // Gespeicherten Hash mit übergebenem Token vergleichen
        const tokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!tokenValid) {
            throw new UnauthorizedException('Zugriff verweigert');
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.saveRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    // Benutzer abmelden - Refresh Token löschen
    async logout(userId: string) {
        await this.usersService.updateRefreshToken(userId, null);
        return { message: 'Erfolgreich abgemeldet' };
    }

    // Access Token und Refresh Token generieren
    private async generateTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const [accessToken, refreshToken] = await Promise.all([
            // Kurzlebiger Access Token
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN'),
            }),
            // Langlebiger Refresh Token
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            }),
        ]);

        return { accessToken, refreshToken };
    }

    // Refresh Token gehasht in der Datenbank speichern
    private async saveRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
    }
}