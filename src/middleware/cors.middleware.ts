import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', `${process.env.ALLOWED_ORIGIN}`);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    console.log(process.env.ALLOWED_ORIGIN, 'process.env.ALLOWED_ORIGIN');

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    next();
  }
}
