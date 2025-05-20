import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';
import {AdminManagementService} from '../../services/admin-management.service';



export enum DashboardScreens {
  INFOS = 'INFOS',
}

@Component({
  selector: 'app-employer-details',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    SidebarComponent
  ],
  templateUrl: './employer-details.component.html',
  styleUrl: './employer-details.component.scss'
})
export class EmployerDetailsComponent  {

  submitted = false;

  employerDetailsForm: FormGroup = new FormGroup({
    Name: new FormControl('', Validators.required),
    LastName: new FormControl('', Validators.required),
    BirthDate: new FormControl('', [Validators.required, Validators.pattern('^\\d{14}$'), Validators.maxLength(14)]),
    Lieux: new FormControl('', Validators.required),
    Id: new FormControl('', Validators.required),
    Mail: new FormControl('', Validators.required),
    PhoneNumber: new FormControl('', Validators.required),
    Company: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required),
    Post: new FormControl('', Validators.required),
    Sexe: new FormControl('', Validators.required),


  });

  onSubmitEmployer(): void {
    this.submitted = true;
    if (this.employerDetailsForm.valid) {
      const formData = this.employerDetailsForm.getRawValue();
      console.log("Formulaire soumis :", formData);
      // TODO: Envoyer les données à l'API pour sauvegarde
    } else {
      this.employerDetailsForm.markAllAsTouched();
    }
  }

  protected readonly DashboardScreens = DashboardScreens;

}
