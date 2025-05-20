export class ServiceSummaryDto {
  id: number;
  title: string;
  description?: string;
  price?: number;
  realisationTime?: string;
  providerName?: string;
  category: 'Service' | 'Événement'; 
  location?: string;
  isMedical?: boolean;
  startDate?: Date | string;
}