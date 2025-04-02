import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Create a JWT token with the user payload
  async createToken(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  // Verify the JWT token
  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }
}
