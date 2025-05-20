import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, NgClass } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-create-pub-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './create-pub-dialog.component.html',
  styleUrls: ['./create-pub-dialog.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-5px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0, transform: 'translateY(-5px)' }))
      ])
    ])
  ]
})
export class CreatePubDialogComponent {
  postForm: FormGroup;
  submitted = false;
  isSubmitting = false;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreatePubDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.postForm = this.fb.group({
      content: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      visibility: ['public']
    });
  }

  get f() { return this.postForm.controls; }


  onSubmit(): void {
    if (this.postForm.valid) {
      const content = this.postForm.value.content;
      this.dialogRef.close(content);
    } else {
      this.submitted = true
      this.postForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }
}
