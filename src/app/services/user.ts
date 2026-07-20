import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDtoResponse } from '../models/user-response.model'; // Importamos el nuevo modelo

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_URL = 'http://localhost:8080/private/user';

  constructor(private http: HttpClient) { }

  getAll(): Observable<UserDtoResponse[]> {
    return this.http.get<UserDtoResponse[]>(this.API_URL);
  }
}