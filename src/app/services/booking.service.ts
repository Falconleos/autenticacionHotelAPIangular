import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BookingDTORequest,
  BookingDTOResponse,
  BookingCancellationDTORequest,
  BookingCancellationDTOResponse,
  RoomDTOResponse
} from '../models/booking.model';




@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly http = inject(HttpClient);
  // URL directa apuntando a tu backend Spring Boot
  private readonly apiUrl = 'http://localhost:8080/private/bookings';

  /**
   * 1. Crear una nueva reserva
   */
  createBooking(request: BookingDTORequest): Observable<BookingDTOResponse> {
    return this.http.post<BookingDTOResponse>(this.apiUrl, request);
  }

  /**
   * 2. Confirmar reserva (PENDING -> CONFIRMED)
   */
  confirmBooking(id: number): Observable<BookingDTOResponse> {
    return this.http.patch<BookingDTOResponse>(`${this.apiUrl}/${id}/confirm`, {});
  }

  /**
   * 3. Cancelar una reserva activa
   */
  cancelBooking(request: BookingCancellationDTORequest): Observable<BookingCancellationDTOResponse> {
    return this.http.post<BookingCancellationDTOResponse>(`${this.apiUrl}/cancel`, request);
  }

  /**
   * 4. Obtener reserva por ID
   */
  getById(id: number): Observable<BookingDTOResponse> {
    return this.http.get<BookingDTOResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * 5. Obtener todas las reservas (con filtro opcional por estado activo)
   */
  getBookings(active?: boolean): Observable<BookingDTOResponse[]> {
    let params = new HttpParams();
    if (active !== undefined && active !== null) {
      params = params.set('active', active);
    }
    return this.http.get<BookingDTOResponse[]>(this.apiUrl, { params });
  }

  /**
   * 6. Buscar habitaciones disponibles según fechas y huéspedes
   */
  getAvailableRooms(checkIn: string, checkOut: string, guestCount: number): Observable<RoomDTOResponse[]> {
    const params = new HttpParams()
      .set('checkIn', checkIn)
      .set('checkOut', checkOut)
      .set('guestCount', guestCount.toString());

    return this.http.get<RoomDTOResponse[]>(`${this.apiUrl}/available-rooms`, { params });
  }

  /**
   * 7. Check-ins del día de hoy
   */
  getTodayCheckIns(): Observable<BookingDTOResponse[]> {
    return this.http.get<BookingDTOResponse[]>(`${this.apiUrl}/today-checkins`);
  }

  /**
   * 8. Reservas pendientes a X días
   */
  getBookingsToConfirmInDays(days: number): Observable<BookingDTOResponse[]> {
    return this.http.get<BookingDTOResponse[]>(`${this.apiUrl}/pending-to-confirm/${days}`);
  }

  /**
   * 9. Procesar No-Shows
   */
  processNoShows(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/process-no-shows`, {});
  }
}