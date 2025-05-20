import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// Admin Guard
export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const role = localStorage.getItem('role');

  if (role !== 'admin') {
    await router.navigate(['/auth']);
    return false;
  }
  return true;
};
