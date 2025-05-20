import { InvoiceStatus } from '../../../common/enum/invoice-status.enum';
import { SubscriptionTier } from '../../../common/enum/subscription-tier.enum';

export class InvoiceSummaryDto {
  id: number;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  status: InvoiceStatus; 
  totalAmount: number;
  documentUrl?: string;
  description: string;
  subscriptionTier: SubscriptionTier | undefined;
}