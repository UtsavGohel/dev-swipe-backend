import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    console.log('JWT Secret:', process.env.JWT_SECRET);
    if (err || !user) {
      console.log(`🚀 ~ JwtAuthGuard ~ handleRequest ~ user:`, user);
      console.log(`🚀 ~ JwtAuthGuard ~ handleRequest ~ err:`, err);
      // Customize the error response when JWT is invalid
      throw new HttpException(
        'Unauthorized: Token is invalid or expired',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
