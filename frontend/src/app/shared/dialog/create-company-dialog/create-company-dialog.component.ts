import { Component , Inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {UsersRoles} from '../../enum/user-roles.enum';


@Component({
  selector: 'app-create-company-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule , NgIf
  ],
  templateUrl: './create-company-dialog.component.html',
  styleUrl: './create-company-dialog.component.scss'
})
export class CreateCompanyDialogComponent {

  submitted = false;


  addCompanyForm: FormGroup = new FormGroup({
    registryNumber: new FormControl('', [Validators.required, Validators.pattern('^\\d{14}$'), Validators.maxLength(14)]),
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    founder: new FormControl('', Validators.required),
    industry: new FormControl('', Validators.required),
    size: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    city: new FormControl('', Validators.required),
    creationDate: new FormControl('', Validators.required),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateCompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onAddNewCompany(): void {
      if (this.addCompanyForm.invalid) {
        this.addCompanyForm.markAllAsTouched();
        this.submitted = true;
        return;
      }
      const formValues = this.addCompanyForm.getRawValue();
      const payload = {
        user: {
          email: formValues.email,
          password: formValues.password,
          isActive: true,
          role: UsersRoles.COMPANY
        },
        name: formValues.name,
        address: formValues.address,
        founder: formValues.founder,
        industry: formValues.industry,
        registryNumber: formValues.registryNumber,
        size: formValues.size,
        phoneNumber: formValues.phoneNumber,
        city: formValues.city,
        creationDate: formValues.creationDate,
      }
      this.dialogRef.close(payload);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }


}
