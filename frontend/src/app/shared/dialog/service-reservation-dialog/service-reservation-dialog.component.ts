import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-service-reservation-dialog',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './service-reservation-dialog.component.html',
  styleUrl: './service-reservation-dialog.component.scss'
})
export class ServiceReservationDialogComponent {
  submitted = false;

  ReservationForm: FormGroup = new FormGroup({
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

  onSubmitReservation(): void {
    this.submitted = true;
    if (this.ReservationForm.valid) {
      const formData = this.ReservationForm.getRawValue();
      console.log("Formulaire soumis :", formData);
      // TODO: Envoyer les données à l'API pour sauvegarde
    } else {
      this.ReservationForm.markAllAsTouched();
    }



  }


  constructor(
    private dialogRef: MatDialogRef<ServiceReservationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  onCancelReservation(): void {
    if (this.ReservationForm.dirty) {
      if (confirm('Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
        this.dialogRef.close(false);
      }
    } else {
      this.dialogRef.close(false);
    }
  }
}
