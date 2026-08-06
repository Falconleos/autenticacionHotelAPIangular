import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingDtoResponse } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/private/booking';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BookingDtoResponse[]> {
    return this.http.get<BookingDtoResponse[]>(this.apiUrl, { withCredentials: true });
  }
}