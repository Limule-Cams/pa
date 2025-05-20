import {Component, inject, OnInit} from '@angular/core';
import {CNavbareComponent} from '../shared/c-navbare/c-navbare.component';
import {CFooterComponent} from '../shared/c-footer/c-footer.component';
import {CompanyService} from '../company.service';
import {DecimalPipe, NgForOf, UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CNavbareComponent,
    CFooterComponent,
    NgForOf,
    UpperCasePipe,
    DecimalPipe
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class CompniesPaymentsComponent implements OnInit {
  private readonly companyService = inject(CompanyService);

  readonly paymentList = this.companyService.companyPayment;

  ngOnInit(): void {
    this.companyService.getCompanyPayment$().subscribe(console.log);
  }

  onDownloadContractClick(fileUrl: string): void {
    try {
      if (!fileUrl || typeof fileUrl !== 'string') {
        console.error('Invalid file URL provided');
        return;
      }
      fileUrl = `http://localhost:3000${fileUrl}`;
      const link = document.createElement('a');
      link.href = fileUrl;

      const fileName = fileUrl.split('/').pop() || `contract_${new Date().getTime()}.pdf`;
      link.download = fileName;

      link.rel = 'noopener noreferrer';
      link.target = '_blank';
      link.setAttribute('aria-label', `Download contract PDF`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.companyService.validateContract$().subscribe();
    } catch (error) {
      console.error('Error downloading contract:', error);
    }
  }

  getValidatedInvoices(): number {
    return this.paymentList().filter((payment: any) => payment.status === 'payed').length;
  }

  getTotalPayedAmount(): number {
    return this.paymentList().reduce((total: number, payment: { totalAmount: string }) => {
      if (!/^-?\d*\.?\d+$/.test(payment.totalAmount.trim())) {
        console.warn('Invalid price format:', payment.totalAmount);
        return total;
      }
      const priceValue = parseFloat(payment.totalAmount);
      return total + priceValue;
    }, 0);
  }

}
