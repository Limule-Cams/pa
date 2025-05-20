import { QuoteStatus } from "../../../common/enum/quote-status.enum";
import { SubscriptionTier } from "../../../common/enum/subscription-tier.enum";

export class CompanyQuoteDto {
    id: number;
    quoteNumber: string;
    numberOfEmployees: number;
    calculatedTier: SubscriptionTier;
    requestedTier?: SubscriptionTier;
    annualPricePerEmployee: number;
    estimatedAnnualTotal: number;
    details?: string;
    status: QuoteStatus;
    validUntil?: Date;
    createdAt: Date;
    linkedContractId?: number | null;
}