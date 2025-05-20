import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const companyGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const role = localStorage.getItem('role');

  if (role !== 'company') {
    await router.navigate(['/auth']);
    return false;
  }
  return true;
};

