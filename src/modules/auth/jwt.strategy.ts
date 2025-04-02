import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtAuthService } from './jwt.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtAuthService: JwtAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          console.log('req?.cookies?.jwt', req?.cookies?.jwt);

          return req?.cookies?.jwt; // Extract JWT from cookies
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!payload) {
      // If the payload is missing, it means the JWT is invalid or expired
      throw new HttpException(
        'Unauthorizedsss: Token is invalid or expired',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return payload; // we can return the user details from the payload
  }
}
