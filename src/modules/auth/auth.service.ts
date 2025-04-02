import {
  BadRequestException,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthService } from './jwt.service';

import { SignInUserDto } from '../users/dto/login-user.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from '../users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async validateUser(reqBody: SignInUserDto) {
    const { email, password } = reqBody;
    console.log(
      `🚀 ~ AuthService ~ validateUser ~ email, password:`,
      email,
      password,
    );

    if (!email || !password) {
      throw new BadRequestException('Missing Credentials');
    }

    const user = await this.userModel.findOne({ email: email });

    console.log(`🚀 ~ AuthService ~ validateUser ~ user:`, user);
    if (!user) {
      throw new UnauthorizedException('Invalid Credential');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log(
      `🚀 ~ AuthService ~ validateUser ~ isPasswordMatch:`,
      isPasswordMatch,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid Credential');
    }

    return user;
  }

  async signInUser(reqBody: SignInUserDto, res: Response) {
    const { email, password } = reqBody;
    const user = await this.validateUser({ email, password });

    const payload = {
      user: user.firstName,
      sub: user._id,
    };
    console.log(`🚀 ~ AuthService ~ signInUser ~ payload:`, payload);

    const token = await this.jwtAuthService.createToken(payload);

    res.cookie('jwt', token, {
      httpOnly: true, // Ensures the cookie can't be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production' ? true : false, // Use true in production for HTTPS
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 3600000, // Set the token to expire in 1 hour
    });

    // Return success message and token
    return res.status(200).json({
      message: `Welcome back, ${user.firstName}! You've successfully logged in.`,
      succes: true,
      token: token,
      data: user,
    });
  }
}
