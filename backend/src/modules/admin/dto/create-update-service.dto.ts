import { IsString, IsNotEmpty, IsNumber, Min, IsBoolean, IsOptional, IsInt, MaxLength } from 'class-validator';

export class CreateUpdateServiceDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(1000)
    description?: string;

    @IsBoolean()
    @IsOptional()
    isAvailable?: boolean = true; 

    @IsNumber()
    @Min(0)
    @IsNotEmpty() 
    price: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    realisationTime: string;

    @IsOptional()
    @IsInt()
    providerId?: number | null; 


    @IsBoolean()
    @IsOptional()
    isMedical?: boolean = false;
}