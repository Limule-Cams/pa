import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-event-participate-dialog',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './event-participate-dialog.component.html',
  styleUrl: './event-participate-dialog.component.scss'
})
export class EventParticipateDialogComponent {
  submitted = false;

  ParticipationForm: FormGroup = new FormGroup({
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

  onSubmitparticipation(): void {
    this.submitted = true;
    if (this.ParticipationForm.valid) {
      const formData = this.ParticipationForm.getRawValue();
      console.log("Formulaire soumis :", formData);
      // TODO: Envoyer les données à l'API pour sauvegarde
    } else {
      this.ParticipationForm.markAllAsTouched();
    }



  }


  constructor(
    private dialogRef: MatDialogRef<EventParticipateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  onCancelParticipation(): void {
    if (this.ParticipationForm.dirty) {
      if (confirm('Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
        this.dialogRef.close(false);
      }
    } else {
      this.dialogRef.close(false);
    }
  }
}
