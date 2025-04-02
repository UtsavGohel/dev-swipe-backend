import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Create a JWT token with the user payload
  async createToken(payload: Record<string, unknown>): Promise<string> {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    console.log(`🚀 ~ JwtAuthService ~ createToken ~ token:`, token);
    return token;
  }

  // Verify the JWT token
  async verifyToken(token: string): Promise<any> {
    console.log(`🚀 ~ JwtAuthService ~ verifyToken payload ~ token:`, token);
    const tokenValue = this.jwtService.verify(token);
    console.log(`🚀 ~ JwtAuthService ~ verifyToken ~ token:`, tokenValue);
    return tokenValue;
  }
}
