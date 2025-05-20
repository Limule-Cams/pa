import { QuoteStatus } from "../../../common/enum/quote-status.enum";
import { SubscriptionTier } from "../../../common/enum/subscription-tier.enum";

export class QuoteDetailsDto {
    id: number;
    quoteNumber: string;
    companyId?: number | null;
    companyName?: string | null;
    contactName?: string;
    contactEmail?: string;
    numberOfEmployees: number;
    calculatedTier: SubscriptionTier;
    requestedTier?: SubscriptionTier;
    annualPricePerEmployee: number;
    estimatedAnnualTotal: number;
    details?: string;
    status: QuoteStatus;
    validUntil?: Date;
    linkedContractId?: number | null;
    createdAt: Date;
    updatedAt: Date;
}