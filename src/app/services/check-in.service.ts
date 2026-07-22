import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckInDTORequest, CheckInDTOResponse, CheckInState } from '../models/check-in.model';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/private/check-in';

  /** Registrar nuevo Check-In (Ingreso) */
  createCheckIn(request: CheckInDTORequest): Observable<CheckInDTOResponse> {
    return this.http.post<CheckInDTOResponse>(this.apiUrl, request, { withCredentials: true });
  }

  /** Registrar Check-Out programado */
  checkOut(id: number): Observable<CheckInDTOResponse> {
    return this.http.put<CheckInDTOResponse>(`${this.apiUrl}/${id}/checkout`, {}, { withCredentials: true });
  }

  /** Interrumpir estadía anticipadamente con motivo */
  interruptStay(id: number, reason: string): Observable<CheckInDTOResponse> {
    const params = new HttpParams().set('reason', reason);
    return this.http.put<CheckInDTOResponse>(`${this.apiUrl}/${id}/interrupt`, {}, { params, withCredentials: true });
  }

  /** Listar todos los check-ins (opcionalmente filtrados por activo) */
  list(active?: boolean): Observable<CheckInDTOResponse[]> {
    let params = new HttpParams();
    if (active !== undefined && active !== null) {
      params = params.set('active', active);
    }
    return this.http.get<CheckInDTOResponse[]>(this.apiUrl, { params, withCredentials: true });
  }

  /** Registrar el pago/saldado de una estadía */
  payStay(id: number): Observable<CheckInDTOResponse> {
    return this.http.put<CheckInDTOResponse>(`${this.apiUrl}/${id}/pay`, {}, { withCredentials: true });
  }
}