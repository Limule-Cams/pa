// Provider Guard (for service providers)
import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const providerGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const role = localStorage.getItem('role');

  console.log(role);

  if (role !== 'provider') {
    await router.navigate(['/auth']);
    return false;
  }
  return true;
};

