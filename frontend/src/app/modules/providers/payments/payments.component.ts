import {Component, inject, OnInit} from '@angular/core';
import {SideBareComponent} from '../shared/side-bare/side-bare.component';
import {ProviderService} from '../provider.service';
import {NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    SideBareComponent,
    NgForOf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent implements OnInit {
  private readonly providerService = inject(ProviderService);
  payments = this.providerService.payments;

  ngOnInit() {
    this.providerService.getPaymentsList$().subscribe(console.log);
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

    } catch (error) {
      console.error('Error downloading contract:', error);
    }
  }

}
