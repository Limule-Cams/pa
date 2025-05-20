import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class RequestQuoteDto {

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    @Type(() => Number)
    numberOfEmployees: number;

    @IsString()
    @IsOptional()
    notes?: string;

}