import {Component, inject, OnInit} from '@angular/core';
import { CNavbareComponent } from '../shared/c-navbare/c-navbare.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {CompanyService} from '../company.service';
import {tap} from 'rxjs';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    CNavbareComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class CompanyProfilComponent implements OnInit {
  private readonly companyService = inject(CompanyService);
  companyInfo = this.companyService.companyDetails;

  isEditMode = false;

  ngOnInit(): void {
      this.companyService.getCompanyInfo$().pipe(
        tap((companyInfo) => this.companyProfilForm.patchValue(companyInfo))
      ).subscribe(console.log);
  }


  companyProfilForm: FormGroup = new FormGroup({
    registryNumber: new FormControl(
      { value: '', disabled: true },
      [Validators.required, Validators.pattern('^\\d{14}$'), Validators.maxLength(14)]
    ),
    id: new FormControl(
      { value: '', disabled: true },
      [Validators.required, Validators.pattern('^\\d{10}$'), Validators.maxLength(10)]
    ),
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    founder: new FormControl('', Validators.required),
    industry: new FormControl('', Validators.required),
    size: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    employeesNumber: new FormControl('', Validators.required),
  });

  getCompanySizeLabel(size: string): string {
    const sizes: Record<string, string> = {
      'micro': 'Micro entreprise',
      'small': 'Petite entreprise',
      'medium': 'Entreprise moyenne',
      'large': 'Grande entreprise'
    };
    return sizes[size] || 'Non spécifié';
  }

  onEditProfile() {
    this.isEditMode = true;
    this.companyProfilForm.enable();
  }

  onSaveProfile() {
    this.companyService.editCompanyProfile(this.companyProfilForm.getRawValue()).subscribe();
    this.isEditMode = false;
  }

  onCancelEdit() {
    this.isEditMode = false;

  }
}
