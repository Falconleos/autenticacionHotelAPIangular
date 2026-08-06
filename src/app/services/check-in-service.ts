import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckInDtoResponse } from '../models/check-in.model';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {
  private apiUrl = 'http://localhost:8080/private/check-in';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CheckInDtoResponse[]> {
    return this.http.get<CheckInDtoResponse[]>(this.apiUrl, { withCredentials: true });
  }
}