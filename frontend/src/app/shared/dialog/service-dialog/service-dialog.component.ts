import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-service-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './service-dialog.component.html',
  styleUrl: './service-dialog.component.scss'
})
export class ServiceDialogComponent implements OnInit{
  constructor(protected readonly dialogRef: MatDialogRef<ServiceDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  readonly serviceForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    isAvailable: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    if (this.data.mode === 'edit') {
      this.serviceForm.patchValue(this.data.service);
    }
  }

  onClosClick(): void {
    this.dialogRef.close(undefined);
  }

  onFormSubmit(): void {
    this.dialogRef.close(this.serviceForm.value);
  }
}
