import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import {AuthService} from '../../modules/main-site/auth/auth.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  //const toastService = inject(ToastService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error instanceof HttpErrorResponse) {
       alert(error.error.message);
      }
      return throwError(() => error);
    })
  );
};
