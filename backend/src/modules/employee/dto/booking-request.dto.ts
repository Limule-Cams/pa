import { IsInt, IsNotEmpty, IsOptional, IsDateString, IsString, ValidateIf } from 'class-validator';

export class BookingRequestDto {
  @ValidateIf(o => !o.eventId) 
  @IsInt()
  @IsNotEmpty()
  serviceId?: number;

  @ValidateIf(o => !o.serviceId) 
  @IsInt()
  @IsNotEmpty()
  eventId?: number;

  @IsDateString()
  @IsNotEmpty()
  bookingDate: string; 

  @IsString()
  @IsOptional()
  notes?: string;
}