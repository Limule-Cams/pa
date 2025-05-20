import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const clientGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const role = localStorage.getItem('role');

  if (role !== 'client') {
    await router.navigate(['/auth']);
    return false;
  }
  return true;
};
