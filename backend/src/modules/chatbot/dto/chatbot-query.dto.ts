import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class ChatbotQueryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    query: string;
}