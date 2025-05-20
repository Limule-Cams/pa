import { IsInt, IsNotEmpty, IsEnum, IsNumber, Min, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { DonationType } from '../../../common/enum/donation-type.enum';

export class MakeDonationDto {
    @IsInt()
    @IsNotEmpty()
    associationId: number;

    @IsEnum(DonationType)
    @IsNotEmpty()
    type: DonationType;

    @ValidateIf(o => o.type === DonationType.FINANCIAL) 
    @IsNumber()
    @Min(1) 
    @IsNotEmpty()
    amount?: number;

    @ValidateIf(o => o.type === DonationType.MATERIAL) 
    @IsString()
    @MaxLength(500)
    @IsNotEmpty()
    description?: string;
}