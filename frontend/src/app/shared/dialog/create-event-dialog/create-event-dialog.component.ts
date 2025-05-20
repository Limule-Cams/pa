import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-create-event-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-event-dialog.component.html',
  styleUrl: './create-event-dialog.component.scss'
})
export class CreateEventDialogComponent {

  eventForm!: FormGroup;

  constructor(private fb: FormBuilder, protected dialogRef: MatDialogRef<CreateEventDialogComponent>,) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.eventForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      description: new FormControl('', [Validators.maxLength(2000)]),
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null),
      location: new FormControl('', [Validators.maxLength(255)]),
      capacity: new FormControl(0, [Validators.min(1)])
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      console.log('invalid');
      this.markFormGroupTouched(this.eventForm);
      return;
    }
    const formValue = {
      ...this.eventForm.value,
      startDate: this.formatDate(this.eventForm.value.startDate),
      endDate: this.formatDate(this.eventForm.value.endDate)
    };

    this.dialogRef.close(formValue);
  }

  onClose(): void {
    this.dialogRef.close(undefined);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private formatDate(dateString: string | null): Date | null {
    if (!dateString) return null;
    return new Date(dateString);
  }
}
