export class AdviceDto {
    id: number;
    title: string;
    summary: string;
    category?: string;
    contentUrl?: string; 
    publicationDate: Date;
}