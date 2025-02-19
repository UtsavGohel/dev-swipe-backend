import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ConnectionRequestModule } from './modules/connection-request/connection-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
    DatabaseModule,
    UsersModule,
    AuthModule,
    ConnectionRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
