import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DatePipe, NgClass, NgIf, registerLocaleData} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import localeFr from '@angular/common/locales/fr';

@Component({
  selector: 'app-booking-info-dialog',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    DatePipe,
    NgIf
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'fr'}
  ],
  templateUrl: './booking-info-dialog.component.html',
  styleUrl: './booking-info-dialog.component.scss'
})
export class BookingInfoDialogComponent implements OnInit {
  constructor(protected readonly dialogRef: MatDialogRef<BookingInfoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    console.log(this.data)
    registerLocaleData(localeFr, 'fr');
  }

  getStatusLabel(status: string): string {
    const statusMap: any = {
      'confirmed': 'Confirmé',
      'cancelled_employee': 'Annulé par l\'employé',
      'cancelled_client': 'Annulé par le client',
      'pending': 'En attente'
    };

    return (statusMap[status] || status) as string;
  }

  onClose(): void {
    this.dialogRef.close(undefined);
  }

  onUpdateBookingStatus(): void {
    if (this.data.service.extendedProps.status === 'confirmed') {
      this.dialogRef.close({action: 'cancel'});
    } else {
      this.dialogRef.close({action: 'confirm'});
    }
  }

  onValidateServiceClick(): void {
    this.dialogRef.close({ action: 'validate' });
  }


}
