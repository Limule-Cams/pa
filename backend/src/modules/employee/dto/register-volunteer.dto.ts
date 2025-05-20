import { IsInt, IsNotEmpty } from 'class-validator';

export class RegisterVolunteerDto {
    @IsInt()
    @IsNotEmpty()
    activityId: number;

    // Optionnel: autres infos si nécessaire
    // @IsString()
    // @IsOptional()
    // comments?: string;
}