import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {AuthService} from '../../modules/main-site/auth/auth.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const userToken = authService.getAccessToken();
  const authRequest = userToken
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${userToken}`,
      },
    })
    : req;
  return next(authRequest);
};
