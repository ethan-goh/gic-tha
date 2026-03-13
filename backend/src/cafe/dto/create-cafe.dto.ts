import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCafeDto {
  @IsString()
  @MinLength(6)
  @MaxLength(10)
  name: string;

  @IsString()
  @MaxLength(256)
  description: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsString()
  location: string;
}
