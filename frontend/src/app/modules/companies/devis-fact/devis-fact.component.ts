import {Component, inject, OnInit} from '@angular/core';
import {CNavbareComponent} from '../shared/c-navbare/c-navbare.component';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {CFooterComponent} from '../shared/c-footer/c-footer.component';
import {SpinnerComponent} from '../../../shared/components/spinner/spinner.component';
import {Router, RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {CompanyService} from '../company.service';
import {AdminManagementService} from '../../admin/services/admin-management.service';

@Component({
  selector: 'app-devis-fact',
  standalone: true,
  imports: [
    CNavbareComponent,
    ReactiveFormsModule,
    CFooterComponent,
    NgIf,
    SpinnerComponent,
    RouterLink
  ],
  templateUrl: './devis-fact.component.html',
  styleUrl: './devis-fact.component.scss'
})
export class DevisFactComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly companyService = inject(CompanyService)
  readonly companyDetails = this.companyService.companyDetails;
  alreadySubscribed = false;
  adminService = inject(AdminManagementService);

  quoteForm: FormGroup = new FormGroup({
    employees: new FormControl(1, [Validators.required, Validators.min(1)]),
    subscriptionType: new FormControl('starter', [Validators.required])
  });

  employeeCount!: number;
  subscriptionType!: string;
  subscriptionTypeLabel!: string;
  pricePerEmployee!: number;
  subtotal!: number;
  vat!: number;
  totalAmount!: number;
  includedActivities!: number;
  includedAppointments!: number;
  additionalAppointmentPrice!: number;
  chatbotAccess!: string;
  weeklyAdvice!: string;
  quoteGenerated = false;

  isLoading: boolean = false;

  devisList = this.adminService.devisList;

  ngOnInit(): void {
    this.companyService.getCompanyInfo$().subscribe(() => {
      if (this.companyDetails().subscriptionTier !== null) {
        this.alreadySubscribed = true;
      }
    });

    this.loadQuote();
  }

  loadQuote(): void {
    this.adminService.getAllDevis().subscribe(console.log);
  }

  getStarterDevis() {
    return this.devisList().find((devis: any) => devis.name === 'starter');
  }

  getBasicDevis() {
    return this.devisList().find((devis: any) => devis.name === 'basic');
  }

  getPremiumDevis() {
    return this.devisList().find((devis: any) => devis.name === 'premium');
  }

  onGenerateQuoteClick(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.employeeCount = this.quoteForm?.get('employees')?.value ?? 1;
    this.subscriptionType = this.quoteForm?.get('subscriptionType')?.value ?? 'starter';

    const selectedDevis = this.devisList().find((devis: any) => devis.name === this.subscriptionType);

    if (!selectedDevis) {
      console.error('Selected devis not found');
      this.isLoading = false;
      return;
    }

    this.subscriptionTypeLabel = this.capitalizeFirstLetter(this.subscriptionType);
    this.pricePerEmployee = parseFloat(selectedDevis.price);
    this.includedActivities = selectedDevis.includedActivities;
    this.includedAppointments = selectedDevis.includedAppointments;
    this.additionalAppointmentPrice = parseFloat(selectedDevis.additionalAppointmentPrice);

    if (selectedDevis.chatbotAccess === 'limited') {
      this.chatbotAccess = `${selectedDevis.chatbotQuestions} questions`;
    } else if (selectedDevis.chatbotAccess === 'unlimited') {
      this.chatbotAccess = 'illimité';
    } else {
      this.chatbotAccess = selectedDevis.chatbotAccess;
    }

    if (this.subscriptionType === 'starter') {
      this.weeklyAdvice = selectedDevis.weeklyAdvice ? 'Oui' : 'Non';
    } else if (this.subscriptionType === 'basic') {
      this.weeklyAdvice = selectedDevis.weeklyAdvice ? 'Oui (non personnalisés)' : 'Non';
    } else {
      this.weeklyAdvice = selectedDevis.weeklyAdvice ? 'Oui personnalisés (suggestion d\'activités)' : 'Non';
    }

    this.subtotal = this.employeeCount * this.pricePerEmployee;
    this.vat = this.subtotal * 0.2; // 20% TVA
    this.totalAmount = this.subtotal + this.vat;

    this.subtotal = Math.round(this.subtotal * 100) / 100;
    this.vat = Math.round(this.vat * 100) / 100;
    this.totalAmount = Math.round(this.totalAmount * 100) / 100;

    setTimeout(() => {
      this.isLoading = false;
      this.quoteGenerated = true;
    }, 1000);
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  proceedToPayment(): void {
    const quoteData = {
      subscriptionType: this.subscriptionType,
      subscriptionTypeLabel: this.subscriptionTypeLabel,
      employeeCount: this.employeeCount,
      pricePerEmployee: this.pricePerEmployee,
      includedActivities: this.includedActivities,
      includedAppointments: this.includedAppointments,
      additionalAppointmentPrice: this.additionalAppointmentPrice,
      chatbotAccess: this.chatbotAccess,
      weeklyAdvice: this.weeklyAdvice,
      subtotal: this.subtotal,
      vat: this.vat,
      totalAmount: this.totalAmount
    };

    this.router.navigate(['/payment'], {state: {quoteData}});
  }

}
