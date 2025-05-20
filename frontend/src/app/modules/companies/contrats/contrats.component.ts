import {Component, inject, OnInit} from '@angular/core';
import {CNavbareComponent} from '../shared/c-navbare/c-navbare.component';
import {DecimalPipe, JsonPipe, NgClass, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {CFooterComponent} from '../shared/c-footer/c-footer.component';
import {CompanyService} from '../company.service';

@Component({
  selector: 'app-contrats',
  standalone: true,
  imports: [
    CNavbareComponent,
    NgIf,
    CFooterComponent,
    NgForOf,
    JsonPipe,
    UpperCasePipe,
    NgClass,
    DecimalPipe
  ],
  templateUrl: './contrats.component.html',
  styleUrl: './contrats.component.scss'
})
export class ContratsComponent implements OnInit {
  private readonly companyService = inject(CompanyService);
  readonly contractList = this.companyService.companyContracts;

  ngOnInit(): void {
    this.companyService.getCompanyContracts$().subscribe(console.log);
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

  getActiveContract(): number {
    return this.contractList().filter((contract: any) => contract.status === 'active').length;
  }

  getExpiredContract(): number {
    return this.contractList().filter((contract: any) => contract.status !== 'active').length;
  }

  getExpensesSummary(): number {
    return this.contractList().reduce((total: number, contract: { price: string }) => {
      if (!/^-?\d*\.?\d+$/.test(contract.price.trim())) {
        console.warn('Invalid price format:', contract.price);
        return total;
      }
      const priceValue = parseFloat(contract.price);
      return total + priceValue;
    }, 0);
  }

  hasContracts(): boolean {
    return this.contractList().length > 0;
  }
}
