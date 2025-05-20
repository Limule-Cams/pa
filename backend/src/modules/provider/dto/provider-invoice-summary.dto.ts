import { InvoiceStatus } from "../../../common/enum/invoice-status.enum";
export class ProviderInvoiceSummaryDto {
    id: number;
    invoiceNumber: string;
    invoiceDate: Date;
    status: InvoiceStatus;
    totalAmount: number;
    documentUrl?: string;
    description: string;
}