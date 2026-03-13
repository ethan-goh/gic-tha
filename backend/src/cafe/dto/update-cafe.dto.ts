import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCafeDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(10)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  description?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
