import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsStrongPassword } from 'src/decorators/custom.decorator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(30, { message: 'Last name must not exceed 30 characters' })
  lastName!: string;

  @IsNumber()
  @IsOptional()
  gender?: number;

  @IsString()
  @IsOptional()
  city?: string;

  @IsNumber()
  @IsOptional()
  age?: number;
}
