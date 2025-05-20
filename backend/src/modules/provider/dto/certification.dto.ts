export class CertificationDto {
    id: number;
    title: string;
    issuingAuthority: string;
    issueDate: Date;
    expiryDate?: Date;
    documentUrl?: string;
    isVerified: boolean;
}