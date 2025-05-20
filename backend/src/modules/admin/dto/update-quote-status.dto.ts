import { IsEnum, IsNotEmpty, IsOptional, IsDateString, IsInt } from 'class-validator';
import { QuoteStatus } from '../../../common/enum/quote-status.enum';
import { Type } from 'class-transformer';

export class UpdateQuoteStatusDto {
    @IsEnum(QuoteStatus)
    @IsNotEmpty()
    status: QuoteStatus;

    @IsDateString()
    @IsOptional()
    validUntil?: string; 

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    linkedContractId?: number | null;
}