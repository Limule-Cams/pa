import {Component, DestroyRef, EventEmitter, inject, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthScreens} from '../auth.component';
import {UsersRoles} from '../../../../shared/enum/user-roles.enum';
import {AuthService} from '../auth.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {tap} from 'rxjs';
import {Router} from '@angular/router';

export enum FormType {
  PROVIDER = 'PROVIDER',
  COMPANY = 'COMPANY',
}


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @Output() changeScreenEvent: EventEmitter<any> = new EventEmitter();

  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);


  step = 1;
  defaultForm: FormType = FormType.COMPANY;
  submitted = false;

  companyForm: FormGroup = new FormGroup({
    companyName: new FormControl('', Validators.required),
    companyOwner: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    siret: new FormControl('', [Validators.required, Validators.pattern('^\\d{14}$'), Validators.maxLength(14)]),
    companySize: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  providerForm: FormGroup = new FormGroup({
    companyName: new FormControl('', Validators.required),
    companyOwner: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    services: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  onScreenChangeClick(): void {
    this.changeScreenEvent.emit(AuthScreens.LOGIN_SCREEN);
  }

  onFormChange(formType: FormType) {
    this.defaultForm = formType;
  }

  registerCompanyClick(): void {
    this.submitted = true;
    if (this.companyForm.valid) {
      const data = this.companyForm.getRawValue();
      const user = {
        email: data.email,
        password: data.password,
        isActive: true,
        role: UsersRoles.COMPANY,
      };
      const payload = {
        user: user,
        name: data.companyName,
        registryNumber: data.siret,
        address: data.address,
        city: data.city,
        creationDate: data.creationDate,
        founder: data.companyOwner,
        industry: data.industry,
        phoneNumber: data.phoneNumber,
        size: data.companySize,
      }
      this.authService.register(payload).pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          alert('Entreprise créer avec success');
          this.onScreenChangeClick();
        })
      ).subscribe();

    } else {
      this.companyForm.markAsTouched();
      this.companyForm.markAsDirty();
    }
  }

  registerProviderClick(): void {
    this.submitted = true;
    if (this.providerForm.valid) {
      const data = this.providerForm.getRawValue();
      const user = {
        email: data.email,
        password: data.password,
        isActive: true,
        role: UsersRoles.PROVIDER,
      };
      const payload = {
        user: user,
        fullName: data.companyOwner,
        referenceName: data.companyName,
        address: data.address,
        phoneNumber: data.phoneNumber,
      }
      this.authService.register(payload).pipe(takeUntilDestroyed(this.destroyRef), tap((response: any) => this.router.navigate(['/provider/registration', response.providerId]))).subscribe();
    } else {
      this.companyForm.markAsTouched();
      this.companyForm.markAsDirty();
    }
  }


  nextStep(): void {
    if (this.defaultForm === FormType.COMPANY) {
      if (this.validateStepOne()) {
        this.step++;
      }
    } else if (this.defaultForm === FormType.PROVIDER) {
      this.step++;
    }
  }


  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }


  private validateStepOne(): boolean | undefined {
    return this.companyForm.get('companyName')?.valid
      && this.companyForm.get('companyOwner')?.valid
      && this.companyForm.get('companySize')?.valid
      && this.companyForm.get('siret')?.valid
      && this.companyForm.get('address')?.valid

  }
  protected readonly FormType = FormType;
}
