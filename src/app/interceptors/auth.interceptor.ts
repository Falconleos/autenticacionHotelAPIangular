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
      withCredentials: true,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    clonedReq = req.clone({ withCredentials: true });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // CAPTURA: Agregamos 403 para interceptar la expiración típica detectada por Spring Security
      const isUnauthorizedOrForbidden = error.status === 401 || error.status === 403;
      const isAuthEndpoint = req.url.includes('/public/auth/');

      if (isUnauthorizedOrForbidden && !isAuthEndpoint) {
        console.log('Token expirado detectado (Status:', error.status, '). Intentando refresco automático...');
        
        return authService.refreshToken().pipe(
          switchMap((response) => {
            console.log('¡Token refrescado con éxito!', response);
            
            // CAMBIO AQUÍ: Usamos accessToken en lugar de token
            localStorage.setItem('token', response.accessToken); 

            const newReq = req.clone({
              withCredentials: true,
              setHeaders: {
                // CAMBIO AQUÍ: Usamos response.accessToken para la petición reintentada
                Authorization: `Bearer ${response.accessToken}` 
              }
            });
            
            return next(newReq);
          }),
          catchError((refreshErr) => {
            console.error('El Refresh Token también expiró o es inválido. Limpiando sesión...');
            authService.logoutClean();
            return throwError(() => refreshErr);
          })
        );
      }
      return throwError(() => error);
    })
  );
};