export class QaDetailsDto {
    id: number;
    question: string;
    keywords: string | null;
    answer: string;
    isActive: boolean;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
}