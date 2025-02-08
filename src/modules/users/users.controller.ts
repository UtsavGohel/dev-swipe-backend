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
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signUpUser(createUserDto);
  }

  @Post('/signin')
  async login(@Body() createUserDto: SignInUserDto, @Res() res: Response) {
    return this.authService.signInUser(createUserDto, res);
  }

  @Post('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt'); // Clear the JWT cookie
    return res.send({ message: 'Logged out successfully' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/getUser')
  async getUser() {
    return this.usersService.getUser();
  }
}
