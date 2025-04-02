import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      // Customize the error response when JWT is invalid
      throw new HttpException(
        'Unauthorized: Token is invalid or expired',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
