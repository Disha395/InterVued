import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

// Benutzermodul - stellt UsersService für andere Module bereit
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService], // Wichtig - AuthModule braucht diesen Service
})
export class UsersModule {}