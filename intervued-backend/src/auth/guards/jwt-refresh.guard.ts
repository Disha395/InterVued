import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Schützt die Refresh-Route - nur mit gültigem Refresh Token zugänglich
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}