import {Component, inject, OnInit} from '@angular/core';
import {NavbareComponent} from '../../employers/shared/navbare/navbare.component';
import {CNavbareComponent} from '../shared/c-navbare/c-navbare.component';
import {CFooterComponent} from "../shared/c-footer/c-footer.component";
import {CompanyService} from '../company.service';
import {MatDialog} from '@angular/material/dialog';
import {CompanyStepsDialogComponent} from '../../../shared/dialog/company-steps-dialog/company-steps-dialog.component';
import {JsonPipe, NgClass, NgIf, UpperCasePipe} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CNavbareComponent,
    CFooterComponent,
    NgIf,
    UpperCasePipe,
    NgClass,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class CompaniesDashboardComponent implements OnInit {

  private readonly companyService = inject(CompanyService);
  private readonly dialog = inject(MatDialog);

  readonly companyInfo = this.companyService.companyDetails;

  ngOnInit(): void {
    this.companyService.getCompanyInfo$().subscribe();
  }

  openStepsDialog(): void {
    this.dialog.open(CompanyStepsDialogComponent);
  }

  getStepsCount(): number {
    const company = this.companyInfo();
    if (!company || company.tutorialCompleted) return 0;
    let nonValidatedCount = 0;

    if (!company.subscriptionCompleted) nonValidatedCount++;
    if (!company.profileCompleted) nonValidatedCount++;
    if (!company.employeesCompleted) nonValidatedCount++;
    if (!company.contractCompleted) nonValidatedCount++;

    return nonValidatedCount;
  }

  getNextPaymentDate(): { date: string, price: number } {
    const company = this.companyInfo();

    if (!company || !company.contracts || company.contracts.length === 0) {
      return { date: 'Aucun contrat', price: 0 };
    }

    const lastContract = company.contracts[company.contracts.length - 1];
    return { date: lastContract.endDate, price: lastContract.price };
  }

  hasContracts(): boolean {
    const company = this.companyInfo();
    return company && company.contracts && company.contracts.length > 0;
  }
}
