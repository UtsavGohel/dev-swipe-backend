import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ConnectionRequestService } from './connection-request.service';

import { JwtAuthGuard } from '../guards/auth.guard';
import { GetUserFeedDto } from './dto/user-feed.dto';

@Controller('connection-request')
export class ConnectionRequestController {
  constructor(
    private readonly connectionRequestService: ConnectionRequestService,
  ) {}

  @Post('/send/:status/:toUserId')
  @UseGuards(JwtAuthGuard)
  async sendConnectionRequest(
    @Req() req,
    @Param('toUserId') toUserId: string,
    @Param('status') status: string,
  ) {
    return this.connectionRequestService.sendConnectionRequest({
      req,
      toUserId,
      status,
    });
  }

  @Post('/review/:status/:requestId')
  @UseGuards(JwtAuthGuard)
  async reviewConnectionRequest(
    @Req() req,
    @Param('status') status: string,
    @Param('requestId') requestId: string,
  ) {
    return this.connectionRequestService.reviewConnectionRequest({
      req,
      status,
      requestId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/recieved-connection-request')
  async getRecievedConnectionRequest(@Req() req) {
    return this.connectionRequestService.getRecievedConnectionRequest(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/connection-list')
  async getUserConnections(@Req() req) {
    return this.connectionRequestService.getUserConnections(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/user/feed')
  async getUserFeed(@Req() req, @Body() reqBody: GetUserFeedDto) {
    return this.connectionRequestService.getUserFeed(req, reqBody);
  }
}
