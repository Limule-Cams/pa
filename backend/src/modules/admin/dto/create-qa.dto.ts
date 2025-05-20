import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQaDto {
    @IsString()
    @IsNotEmpty()
    question: string;

    @IsString()
    @IsNotEmpty()
    answer: string;

    @IsString()
    @IsOptional()
    keywords?: string; 

    @IsInt()
    @Min(0)
    @Max(100) 
    @IsOptional()
    @Type(() => Number)
    priority?: number = 0;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;
}