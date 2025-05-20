

import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import {JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {filter, map, switchMap, tap} from 'rxjs';
import {AdminManagementService} from '../../services/admin-management.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../../../shared/dialog/confirmation-dialog/confirmation-dialog.component';

export enum DashboardScreens {
  INFOS = 'INFOS',
  PAYMENT = 'PAYMENT',
  SERVICES = 'SERVICES',
  EMPLOYERS = 'EMPLOYERS',
  BILLS = 'BILLS',
}

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [SidebarComponent, NgIf, ReactiveFormsModule, NgForOf, JsonPipe, NgClass],
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
  defaultForm = DashboardScreens.INFOS;
  submitted = false;
  companyId!: number;

  dialog = inject(MatDialog);

  companyDetailsForm: FormGroup = new FormGroup({
    registryNumber: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^\\d{14}$'), Validators.maxLength(14)]),
    id: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern('^\\d{10}$'), Validators.maxLength(10)]),
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

  activatedRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  adminService = inject(AdminManagementService);
  router = inject(Router);

  companyDetails = this.adminService.companyDetails;


  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(params => !!params['id']),
      map(params => params['id']),
      switchMap((companyId) => this.adminService.getCompanyDetails(companyId)),
      tap(company => {
        this.companyId = company.id;
        this.companyDetailsForm.patchValue(company);
        this.companyDetailsForm.controls['email'].setValue(company.user.email);
        this.companyDetailsForm.controls['employeesNumber'].setValue(company.employees.length);
      }),
    ).subscribe(console.log);

    if (this.defaultForm === DashboardScreens.PAYMENT) {
      this.adminService.getSubscriptions(this.companyId).subscribe();
    }
  }

  onUpdateCompanyDetails(): void {
    if (this.companyDetailsForm.invalid) {
      alert('Form invalid');
    }
    const payload = this.companyDetailsForm.getRawValue();
    this.adminService.updateCompany(payload, this.companyId).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(() => alert('Entreprise modifier'))
    ).subscribe();
  }

  onDeleteCompanyClick(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {message: 'Etes vous sure de vouloir supprimer cette entreprise', title: 'Supprimer'},
    });
    dialogRef.afterClosed().pipe(
      filter(result => !!result),
      switchMap(() => this.adminService.deleteCompany(this.companyId)),
      takeUntilDestroyed(this.destroyRef),
      tap(() => this.router.navigate(['/admin/companies']),)
    ).subscribe()
  }

  onValidForm(): void {
    this.submitted = true;
    if (this.companyDetailsForm.valid) {
      const formData = this.companyDetailsForm.getRawValue();
      console.log("Formulaire soumis :", formData);
    } else {
      this.companyDetailsForm.markAllAsTouched();
    }
  }


  onScreenChange(screen: DashboardScreens) {
    this.defaultForm = screen;
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


  protected readonly DashboardScreens = DashboardScreens;


}

