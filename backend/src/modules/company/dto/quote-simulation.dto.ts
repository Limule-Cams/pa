import { IsArray, IsNotEmpty, IsNumber, IsPositive, ArrayMinSize, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QuoteSimulationDto {

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  numberOfEmployees: number;
}