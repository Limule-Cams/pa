import { QuoteStatus } from "../../../common/enum/quote-status.enum";

export class QuoteListItemDto {
    id: number;
    quoteNumber: string;
    companyName?: string | null;
    contactEmail?: string | null;
    numberOfEmployees: number;
    estimatedAnnualTotal: number;
    status: QuoteStatus;
    createdAt: Date;
    validUntil?: Date;
}