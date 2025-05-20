export class ServiceDetailsDto {
    id: number;
    title: string;
    description?: string;
    isAvailable: boolean;
    price: number;
    realisationTime: string;
    providerId?: number | null;
    providerName?: string | null; 
    isMedical: boolean;

}