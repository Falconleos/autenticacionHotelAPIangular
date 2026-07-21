import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginDTORequest } from '../models/auth-request.model';
import { Observable } from 'rxjs';
import { AuthTokenResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly API_URL = 'http://localhost:8080/public/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: UserLoginDTORequest): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(`${this.API_URL}/login`, credentials, { withCredentials: true });
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/refresh`, {}, { withCredentials: true });
  }

  logoutClean(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Decodifica el token para obtener los claims/payload
  getTokenPayload(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = atob(payloadBase64);
      return JSON.parse(decodedJson);
    } catch (e) {
      console.error('Error al decodificar token JWT', e);
      return null;
    }
  }

  // Obtiene el rol del usuario logueado (soporta array de roles o string simple)
  getUserRole(): string | null {
    const payload = this.getTokenPayload();
    if (!payload) return null;

    // Dependiendo de tu Spring Boot, el rol suele venir en 'role', 'roles' o 'authorities'
    const roles = payload.role || payload.roles || payload.authorities;
    if (Array.isArray(roles)) {
      // Si viene como ['ROLE_ADMIN'] o ['ADMIN']
      return roles[0]?.replace('ROLE_', '') || null;
    }
    return typeof roles === 'string' ? roles.replace('ROLE_', '') : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isRecepcionist(): boolean {
    return this.getUserRole() === 'RECEPCIONIST';
  }

  canCreateUser(): boolean {
    return this.isAdmin() || this.isRecepcionist();
  }

hasRole(requiredRole: string): boolean {
    const role = this.getUserRole();
    return role === requiredRole || role === `ROLE_${requiredRole}`;
  }

}