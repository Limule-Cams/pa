import { SlotStatus } from "../../../common/enum/slot-status.enum";
import { IsDateString, IsNotEmpty, IsEnum, IsOptional } from "class-validator";

export class AvailabilitySlotDto {
    id?: number;

    @IsNotEmpty({ message: 'Start time cannot be empty' })
    @IsDateString({}, { message: 'Start time must be a valid ISO 8601 date string' })
    startTime: string;

    @IsNotEmpty({ message: 'End time cannot be empty' })
    @IsDateString({}, { message: 'End time must be a valid ISO 8601 date string' })
    endTime: string;
}