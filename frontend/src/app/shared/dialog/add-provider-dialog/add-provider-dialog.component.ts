import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-provider-dialog',
  standalone: true,
  imports: [ FormsModule,
    NgIf,
    ReactiveFormsModule],
  templateUrl: './add-provider-dialog.component.html',
  styleUrl: './add-provider-dialog.component.scss'
})
export class AddProviderDialogComponent {


  submitted = false;




  addProviderForm: FormGroup = new FormGroup({
    Id: new FormControl('', [Validators.required, Validators.pattern('^\\d{10}$'), Validators.maxLength(10)]),
    Name: new FormControl('', Validators.required),
    FName: new FormControl('', Validators.required),
    Mail: new FormControl('', Validators.required),
    Phonumber: new FormControl('', Validators.required),
    Adresse: new FormControl('', Validators.required),
    Type: new FormControl('', Validators.required),
    Status: new FormControl('', Validators.required),
  });

  onAddNewEmployer(): void {
    this.submitted = true;
    if (this.addProviderForm.valid) {
      const formData = this.addProviderForm.getRawValue();
      console.log("Formulaire soumis :", formData);
      // TODO: Envoyer les données à l'API pour sauvegarde
    } else {
      this.addProviderForm.markAllAsTouched();
    }



  }


  constructor(
    private dialogRef: MatDialogRef<AddProviderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  onCancel(): void {
    if (this.addProviderForm.dirty) {
      if (confirm('Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
        this.dialogRef.close(false);
      }
    } else {
      this.dialogRef.close(false);
    }
  }

}
