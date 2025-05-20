import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {map, tap} from 'rxjs';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ProviderService} from '../provider.service';

@Component({
  selector: 'app-provider-regestration',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './provider-regestration.component.html',
  styleUrl: './provider-regestration.component.scss'
})
export class ProviderRegestrationComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly providerService = inject(ProviderService);
  private readonly router = inject(Router);

  providerId!: number;
  providerDetailsForm!: FormGroup;
  step = 1;
  submitted = false;
  expandedServices: boolean[] = [];

  registrationSuccess: boolean = false;

  ngOnInit() {
    this.activatedRoute.params.pipe(
      takeUntilDestroyed(this.destroyRef),
      map(params => params['id']),
      tap((providerId: number) => this.providerId = providerId)
    ).subscribe()
    this.initForm();
  }

  get services(): FormArray {
    return this.providerDetailsForm.get('services') as FormArray;
  }

  get documents(): FormArray {
    return this.providerDetailsForm.get('documents') as FormArray;
  }

  addService(): void {
    this.services.push(this.createServiceGroup());
    this.expandedServices[this.services.length - 1] = true;
  }

  removeService(index: number): void {
    if (this.services.length > 1) {
      this.services.removeAt(index);
    }
  }

  addDocument(): void {
    this.documents.push(this.createDocumentGroup());
  }

  removeDocument(index: number): void {
    if (this.documents.length > 1) {
      this.documents.removeAt(index);
    }
  }

  onFileChange(event: any, index: number): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const documentGroup = this.documents.at(index) as FormGroup;

      documentGroup.patchValue({
        file: file,
        fileName: file.name
      });
    }
  }

  nextStep(): void {
    this.submitted = true;

    if (this.step === 1) {
      const step1Controls = [
        'siret', 'businessType', 'mainActivity', 'yearsExperience', 'description'
      ];

      const step1Valid = step1Controls.every(controlName =>
        !this.providerDetailsForm.get(controlName)?.errors
      );

      if (step1Valid) {
        this.step++;
        this.submitted = false;
      }
    } else if (this.step === 2) {
      const servicesValid = this.services.controls.every((control: any) =>
        !control.get('title')?.errors &&
        !control.get('price')?.errors &&
        !control.get('description')?.errors
      );

      if (servicesValid) {
        this.step++;
        this.submitted = false;
      }
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
      this.submitted = false;
    }
  }

  submitForm(): void {
    this.submitted = true;
    if (this.providerDetailsForm.valid) {
      const formValue = this.providerDetailsForm.getRawValue();
      const formData = new FormData();

      formData.append('providerId', this.providerId.toString());
      formData.append('siret', formValue.siret);
      formData.append('mainActivity', formValue.mainActivity);
      formData.append('yearsExperience', formValue.yearsExperience);
      formData.append('description', formValue.description);

      formData.append('services', JSON.stringify(formValue.services));

      formValue.documents.forEach((doc: any, index: number) => {
        if (doc.file) {
          formData.append(`documents[${index}].file`, doc.file, doc.fileName);
          formData.append(`documents[${index}].title`, doc.title);
          formData.append(`documents[${index}].type`, doc.type);
          formData.append(`documents[${index}].description`, doc.description || '');
        }
      });

      this.providerService.registerNewProvider$(formData).pipe(takeUntilDestroyed(this.destroyRef), tap(() => {
          this.registrationSuccess = true;
          setTimeout(async () => {
            await this.router.navigate(['']);
          }, 3000)
        })
      ).subscribe();

    } else {
      console.log('Form is invalid');
      this.validateAllFormFields(this.providerDetailsForm);
    }
  }

  toggleService(index: number): void {
    this.expandedServices[index] = !this.expandedServices[index];
  }

  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.length; i++) {
          if (control.at(i) instanceof FormGroup) {
            this.validateAllFormFields(control.at(i) as FormGroup);
          }
        }
      } else {
        control?.markAsTouched();
      }
    });
  }

  private initForm(): void {
    this.providerDetailsForm = this.fb.group({
      siret: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      mainActivity: ['', Validators.required],
      yearsExperience: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(5)]],

      services: this.fb.array([
        this.createServiceGroup()
      ]),

      documents: this.fb.array([
        this.createDocumentGroup()
      ])
    });
  }

  private createServiceGroup(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      negotiable: [false],
      description: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  private createDocumentGroup(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      file: [null, Validators.required],
      fileName: [''],
      description: ['']
    });
  }


}
