import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDtoResponse } from '../models/user-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_URL = 'http://localhost:8080/private/user';

  constructor(private http: HttpClient) { }

  getAll(): Observable<UserDtoResponse[]> {
    return this.http.get<UserDtoResponse[]>(this.API_URL);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  createUser(user: any): Observable<UserDtoResponse> {
    return this.http.post<UserDtoResponse>(this.API_URL, user);
  }

  // 1. Recuperar los datos actuales del usuario por ID para el formulario
  getById(id: number): Observable<UserDtoResponse> {
    return this.http.get<UserDtoResponse>(`${this.API_URL}/${id}`);
  }

  // 2. Enviar los datos editados al backend sin tocar contraseña ni roles
  updateUser(id: number, user: any): Observable<UserDtoResponse> {
    return this.http.put<UserDtoResponse>(`${this.API_URL}/${id}`, user);
  }

  // Nuevo método para resetear la contraseña desde el operador
  resetPassword(id: number, newPassword: string): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/${id}/reset-password`, 
      { newPassword }, 
      { withCredentials: true }
    );
  }

}