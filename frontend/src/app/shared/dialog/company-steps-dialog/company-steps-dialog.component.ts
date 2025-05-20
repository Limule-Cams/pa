import {Component, inject, ViewChild} from '@angular/core';
import {NgIf} from '@angular/common';
import {MatDialogRef} from '@angular/material/dialog';
import {CompanyService} from '../../../modules/companies/company.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-company-steps-dialog',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './company-steps-dialog.component.html',
  styleUrl: './company-steps-dialog.component.scss'
})
export class CompanyStepsDialogComponent {

  constructor(private dialogRef: MatDialogRef<CompanyStepsDialogComponent>) {}
  private readonly companyService = inject(CompanyService);
  private readonly router = inject(Router);

  private readonly companyInfo = this.companyService.companyDetails;


  step1Completed = this.companyInfo().subscriptionCompleted;
  step2Completed =  this.companyInfo().profileCompleted;
  step3Completed = this.companyInfo().employeesCompleted;
  step4Completed = this.companyInfo().contractCompleted;
  currentStep = 1;

  get completedStepsCount(): number {
    return [this.step1Completed, this.step2Completed, this.step3Completed, this.step4Completed]
      .filter(completed => completed).length;
  }

  get allStepsCompleted(): boolean {
    return this.completedStepsCount === 4;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onStepClick(step: number): void {
    switch (step) {
      case 1: this.router.navigate(['/companies/devis-fact']); break;
      case 2: this.router.navigate(['/companies/profile']); break;
      case 3: this.router.navigate(['/companies/collab']); break;
      case 4: this.router.navigate(['/companies/contract']); break;
    }
    this.dialogRef.close();
  }
}
