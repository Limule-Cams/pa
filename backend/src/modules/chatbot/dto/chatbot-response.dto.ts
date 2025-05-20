export class ChatbotResponseDto {
    answer: string; 
    sourceId?: number; 
    matchConfidence?: number; 
    limitReached?: boolean;
    remainingQueries?: number | 'illimité'; 
}