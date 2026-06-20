import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtRefreshStrategy} from "./strategies/jwt.refresh.strategy";
import {JwtStrategy} from "./strategies/jwt.strategy";

// Authentifizierungsmodul - verwaltet Login, Registrierung und Token
@Module({
  imports: [
      UsersModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: {expiresIn: configService.get('JWT_EXPIRES_IN')},
        }),
        inject: [ConfigService],
      })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
