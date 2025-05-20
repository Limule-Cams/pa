export class QuoteResultDto {
  estimatedAnnualPrice: number; 
  pricePerEmployeePerYear: number; 
  tierApplied: string; 
  details: string;
  warnings?: string[];
}