import { Module } from '@nestjs/common';
import { ConnectionRequestService } from './connection-request.service';
import { ConnectionRequestController } from './connection-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { connectionRequestSchema } from './connection-request.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ConnectionRequest', schema: connectionRequestSchema },
    ]),
    UsersModule,
  ],
  controllers: [ConnectionRequestController],
  providers: [ConnectionRequestService],
  exports: [MongooseModule],
})
export class ConnectionRequestModule {}
