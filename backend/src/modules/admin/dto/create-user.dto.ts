import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UsersRoles } from '../../../common/enum/roles.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: UsersRoles;

  @IsBoolean()
  isActive: boolean = true;
}