import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Schützt Routen - nur mit gültigem Access Token zugänglich
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}