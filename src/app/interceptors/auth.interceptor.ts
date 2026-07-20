import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  let clonedReq = req;

  // 1. Inyectamos el token y configuramos credentials para el intercambio seguro de cookies
  if (token) {
    clonedReq = req.clone({
      withCredentials: true, // <- Clave para que viajen las cookies HttpOnly
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    // Incluso sin token, permitimos credenciales para el Login/Refresh inicial
    clonedReq = req.clone({ withCredentials: true });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/public/auth/')) {
        
        return authService.refreshToken().pipe(
          switchMap((response) => {
            localStorage.setItem('token', response.token);

            const newReq = req.clone({
              withCredentials: true, // <- También en la petición reintentada
              setHeaders: {
                Authorization: `Bearer ${response.token}`
              }
            });
            
            return next(newReq);
          }),
          catchError((refreshErr) => {
            authService.logoutClean();
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => error);
    })
  );
};