import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {AuthService} from '../../modules/main-site/auth/auth.service';


export const  authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authToken = authService.getAccessToken();

  if (!authToken) {
    await router.navigate(['/home']);
    return false;
  }
  return true;
};
