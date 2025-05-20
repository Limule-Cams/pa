import { CompanyStatus } from "../../../common/enum/company-status.enum";
import { SubscriptionTier } from "../../../common/enum/subscription-tier.enum"; 

export class CompanyListItemDto {
    id: number;
    name: string;
    registryNumber: string;
    city?: string;
    status: CompanyStatus;
    subscriptionTier?: SubscriptionTier;
    employeeCount: number;
    creationDate?: Date;
    userEmail?: string;
    phoneNumber?: string;
}