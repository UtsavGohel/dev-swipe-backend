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
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signUpUser(createUserDto);
  }

  @Post('/signin')
  async login(@Body() createUserDto: SignInUserDto, @Res() res: Response) {
    return this.authService.signInUser(createUserDto, res);
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
  async editProfile(@Body() createUserDto: SignInUserDto) {
    // return this.usersService.editProfile(createUserDto, res);
    //edit just fname,lname,city,gender,age
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  async changePassword(@Body() createUserDto: SignInUserDto) {
    // return this.usersService.editProfile(createUserDto, res);
    //take new pwd, new pwd strong and not equal to last, hash and update in DB
  }
}
