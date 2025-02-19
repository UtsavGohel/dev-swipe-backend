import { Injectable, Res } from '@nestjs/common';
import { JwtAuthService } from './jwt.service';
import { UsersService } from '../users/users.service';
import { SignInUserDto } from '../users/dto/login-user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly usersService: UsersService,
  ) {}

  async signInUser(reqBody: SignInUserDto, res: Response) {
    const { email, password } = reqBody;
    const user = await this.usersService.validateUser({ email, password });

    const payload = {
      user: user.firstName,
      sub: user._id,
    };

    const token = await this.jwtAuthService.createToken(payload);

    res.cookie('token', token, {
      httpOnly: true, // Ensures the cookie can't be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production' ? true : false, // Use true in production for HTTPS
      maxAge: 3600000, // Set the token to expire in 1 hour
    });

    // Return success message and token
    return res.status(200).json({
      message: `Welcome back, ${user.firstName}! You've successfully logged in.`,
      token: token,
      data: user,
    });
  }
}
