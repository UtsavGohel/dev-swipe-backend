import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './modules/guards/auth.guard';
import * as cookieParser from 'cookie-parser';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalGuards(new JwtAuthGuard());

  app.use(cookieParser()); // This allows cookies to be parsed

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTOs
      whitelist: true, // Strips properties that do not have any decorators
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are found
    }),
  );

  await app.listen(3000);
}
bootstrap();
