import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core'; // Corregido acá
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // <- Corregido acá
    provideRouter(routes),
    
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};