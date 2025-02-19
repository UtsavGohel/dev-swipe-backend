import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserFeedDto {
  @IsNumber()
  @IsNotEmpty()
  start!: number;

  @IsNumber()
  @IsNotEmpty()
  limit!: number;
}
