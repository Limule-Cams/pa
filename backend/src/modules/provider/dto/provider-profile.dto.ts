import { ContractStatus } from "../../../common/enum/contract-status.enum";
import { CertificationDto } from "./certification.dto";

export class ProviderProfileDto {
    id: number; 
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    address?: string;
    phoneNumber?: string;
    isAvailable: boolean; 
    isVerified: boolean;
    rating: number;
    bankAccountNumber?: string;
    validationStatus: ContractStatus; 
    certifications: CertificationDto[]; 
}