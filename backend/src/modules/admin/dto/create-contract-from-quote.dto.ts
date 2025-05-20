import { IsInt, IsNotEmpty, IsOptional, IsDateString, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContractFromQuoteDto {
    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    quoteId: number; 

    @IsDateString()
    @IsOptional()
    startDate?: string; 

    @IsDateString()
    @IsOptional()
    endDate?: string; 

    @IsString()
    @IsOptional()
    conditions?: string; 

    @IsString()
    @IsOptional() 
    fileUrl?: string;
}