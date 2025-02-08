import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { JwtAuthModule } from './jwt.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule, JwtAuthModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtAuthService, JwtStrategy],
})
export class AuthModule {}
