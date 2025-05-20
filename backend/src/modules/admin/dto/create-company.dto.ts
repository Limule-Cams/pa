import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  registryNumber: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsDateString()
  creationDate: Date;

  @IsNotEmpty()
  @IsString()
  founder: string;

  @IsNotEmpty()
  @IsString()
  industry: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsNotEmpty()
  size: string;

  @IsNotEmpty()
  user: CreateUserDto;
}
