import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, IsDateString, IsEnum } from 'class-validator';
import { ContractType } from '../../../common/enum/contract-type.enum';

export class LinkEmployeeDto {
    @IsEmail()
    @IsNotEmpty()
    email: string; 

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    occupied_job: string;

    @IsOptional()
    @IsString()
    @MaxLength(160)
    address?: string;

    @IsOptional()
    @IsDateString()
    startingDate?: string = new Date().toISOString().split('T')[0];

    @IsOptional()
    @IsEnum(ContractType)
    contractType?: ContractType = ContractType.CDI; 
}