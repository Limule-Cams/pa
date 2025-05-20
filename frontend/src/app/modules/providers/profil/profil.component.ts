import {Component, inject, OnInit} from '@angular/core';
import {SideBareComponent} from '../shared/side-bare/side-bare.component';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ProviderService} from '../provider.service';
import {tap} from 'rxjs';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    SideBareComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent implements OnInit {
  private readonly providerService: ProviderService = inject(ProviderService);
  providerData = this.providerService.providerInfos;

  readonly providerProfilForm: FormGroup = new FormGroup({
    registryNumber: new FormControl('', [Validators.required]),
    fullName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$')
    ]),
    address: new FormControl('', []),
    mainActivity: new FormControl('', [Validators.required]),
    isAvailable: new FormControl('', [Validators.required]),
  });

  submitted = false;

  ngOnInit() {
    this.providerService.getProviderData().pipe(
      tap(providerData => {
        this.providerProfilForm.patchValue(providerData);
        this.providerProfilForm.get('email')?.setValue(providerData.user.email);
      })
    ).subscribe(console.log);
  }


  onSubmitProfil(): void {
    this.submitted = true;
    if (this.providerProfilForm.valid) {
      const formData = this.providerProfilForm.getRawValue();
      console.log("Formulaire soumis :", formData);
      // TODO: Envoyer les données à l'API pour sauvegarde
    } else {
      this.providerProfilForm.markAllAsTouched();
    }
  }
}
