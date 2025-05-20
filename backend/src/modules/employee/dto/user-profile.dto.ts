import { ContractType } from "../../../common/enum/contract-type.enum";
import { CompanyStatus } from "../../../common/enum/company-status.enum";
import { SubscriptionTier } from "../../../common/enum/subscription-tier.enum";


export class UserProfileDto {
  employeeId: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  occupied_job: string;
  companyId: number;
  companyName: string;
  companyStatus: CompanyStatus;
  companySubscriptionTier?: SubscriptionTier;
  employeeContractType: ContractType;
  employeeStartDate: Date;
  employeeEndDate?: Date;
}