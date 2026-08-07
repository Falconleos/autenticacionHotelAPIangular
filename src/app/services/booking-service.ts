import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingDtoResponse } from '../models/booking.model';
import { RoomDtoResponse } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/private/booking';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BookingDtoResponse[]> {
    return this.http.get<BookingDtoResponse[]>(this.apiUrl, { withCredentials: true });
  }

  getAvailableRooms(checkIn: string, checkOut: string, guestCount: number): Observable<RoomDtoResponse[]> {
    return this.http.get<RoomDtoResponse[]>(`${this.apiUrl}/available-rooms/${checkIn}/${checkOut}/${guestCount}`, {
      withCredentials: true
    });
  }

  createBooking(request: any): Observable<BookingDtoResponse> {
    return this.http.post<BookingDtoResponse>(this.apiUrl, request, { withCredentials: true });
  }

}