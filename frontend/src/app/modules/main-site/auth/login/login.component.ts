import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthScreens } from '../auth.component';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersRoles } from '../../../../shared/enum/user-roles.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Output() changeScreenEvent: EventEmitter<any> = new EventEmitter();

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  submitted = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  onScreenChangeClick(): void {
    this.changeScreenEvent.emit(AuthScreens.REGISTER_SCREEN);
  }

  async onLoginClick(): Promise<void> {
    this.submitted = true;

    if (this.loginForm.valid) {
      const payload = this.loginForm.getRawValue();
      console.log(payload);

      try {
        const result = await this.authService.login$(payload).toPromise(); // Conversion de l'observable en promesse
        this.authService.saveAccessToken(result.accessToken);
        await this.redirectUser(result.role);
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private async redirectUser(userRole: UsersRoles): Promise<void> {
    switch (userRole) {
      case UsersRoles.ADMIN:
        await this.router.navigate(['/admin/dashboard']);
        localStorage.setItem('role', UsersRoles.ADMIN);
        break;
      case UsersRoles.CLIENT:
        await this.router.navigate(['/employer/home']);
        localStorage.setItem('role', UsersRoles.CLIENT);
        break;
      case UsersRoles.COMPANY:
        await this.router.navigate(['/companies/dashboard']);
        localStorage.setItem('role', UsersRoles.COMPANY);
        break;
      case UsersRoles.PROVIDER:
        await this.router.navigate(['/provider/dashboard']);
        localStorage.setItem('role', UsersRoles.PROVIDER);
        break;
      default:
        await this.router.navigate(['/auth']);
    }
  }
}
