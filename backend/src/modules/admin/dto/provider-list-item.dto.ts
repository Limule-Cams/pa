import { ContractStatus } from "../../../common/enum/contract-status.enum";

export class ProviderListItemDto {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    isAvailable: boolean;
    isVerified: boolean;
    validationStatus: ContractStatus;
    rating: number;
    serviceCount: number;
    certificationCount: number;
    pendingCertificationCount: number;
}