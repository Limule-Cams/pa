import {Component, Inject} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-employer-dialog',
  standalone: true,
  imports: [ FormsModule,
    NgIf,
    ReactiveFormsModule],
  templateUrl: './add-employer-dialog.component.html',
  styleUrl: './add-employer-dialog.component.scss'
})
export class AddEmployerDialogComponent {

  submitted = false;

  AddEmployerForm: FormGroup = new FormGroup({
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


  onAddNewEmployer(): void {
    this.submitted = true;
    if (this.AddEmployerForm.valid) {
      const formData = this.AddEmployerForm.getRawValue();
      console.log("Formulaire soumis :", formData);
      // TODO: Envoyer les données à l'API pour sauvegarde
    } else {
      this.AddEmployerForm.markAllAsTouched();
    }



  }


  constructor(
    private dialogRef: MatDialogRef<AddEmployerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  onCancel(): void {
    if (this.AddEmployerForm.dirty) {
      if (confirm('Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
        this.dialogRef.close(false);
      }
    } else {
      this.dialogRef.close(false);
    }
  }
}
