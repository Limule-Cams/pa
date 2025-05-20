import { IsString, IsOptional, MaxLength, IsBoolean, IsPhoneNumber, IsIBAN, IsUrl } from 'class-validator';

export class UpdateProviderProfileDto {
    @IsOptional() @IsString() @MaxLength(100) firstName?: string;
    @IsOptional() @IsString() @MaxLength(100) lastName?: string;
    @IsOptional() @IsString() @MaxLength(160) address?: string;
    @IsOptional() @IsPhoneNumber('FR') phoneNumber?: string;
    @IsOptional() @IsBoolean() isAvailable?: boolean;
    @IsOptional() @IsIBAN() bankAccountNumber?: string;
}