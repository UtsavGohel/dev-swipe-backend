import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async create(@Body() reqBody: CreateUserDto, @Res() res: Response) {
    return this.usersService.signUpUser(reqBody, res);
  }

  @Post('/signin')
  async login(@Body() reqBody: SignInUserDto, @Res() res: Response) {
    return this.authService.signInUser(reqBody, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt'); // Clear the JWT cookie
    return res
      .status(200)
      .send({ success: true, message: 'Logged out successfully' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/edit-profile')
  async editProfile(@Req() req, @Body() reqBody: UpdateUserDto) {
    return this.usersService.editProfile(req, reqBody);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  async changePassword(@Req() req, @Body() reqBody: UpdateUserDto) {
    return this.usersService.changePassword(req, reqBody);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/get-profile')
  async getUserProfile(@Req() req) {
    return this.usersService.getUserProfile(req);
  }
}
