import { IsString, IsNotEmpty, MaxLength, IsOptional, IsDateString, IsInt, Min, IsBoolean, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsOptional()
    endDate?: string; 

    @IsString()
    @MaxLength(255)
    @IsOptional()
    location?: string;

    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    capacity?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;

    @IsUrl()
    @IsOptional()
    imageUrl?: string;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    companyId?: number | null;
}