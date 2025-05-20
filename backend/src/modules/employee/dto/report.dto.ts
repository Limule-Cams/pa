import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class ReportDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    content: string;
}