import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; // Importamos el Router
import { UserLoginDTORequest } from '../models/auth-request.model';
import { Observable } from 'rxjs';
import { AuthTokenResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly API_URL = 'http://localhost:8080/public/auth';

  // Inyectamos el Router en el constructor junto al HttpClient
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: UserLoginDTORequest): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(`${this.API_URL}/login`, credentials, { withCredentials: true });
  }

  // 1. Método para refrescar el token usando la cookie
  // Tu API de Spring Boot devuelve un RefreshTokenDtoResponse (que contiene el nuevo token string)
  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/refresh`, {}, { withCredentials: true });
  }

  // 2. Método de limpieza por si el refresh falla (sesión expirada por completo)
  logoutClean(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}