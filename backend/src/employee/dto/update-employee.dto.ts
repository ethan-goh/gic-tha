import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Gender } from '../employee.entity';
import { IsSgPhoneNumber } from '../../common/validators/sg-phone.validator';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(10)
  name?: string;

  @IsOptional()
  @IsEmail()
  email_address?: string;

  @IsOptional()
  @IsSgPhoneNumber()
  phone_number?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsUUID()
  cafeId?: string;
}
