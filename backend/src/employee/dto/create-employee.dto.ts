import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Gender } from '../employee.entity';
import { IsSgPhoneNumber } from '../../common/validators/sg-phone.validator';

export class CreateEmployeeDto {
  @IsString()
  @MinLength(6)
  @MaxLength(10)
  name: string;

  @IsEmail()
  email_address: string;

  @IsSgPhoneNumber()
  phone_number: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsUUID()
  cafeId?: string;
}
