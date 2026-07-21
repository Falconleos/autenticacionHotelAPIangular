import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomRequest, RoomResponse, RoomUpdateRequest } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly apiUrl = 'http://localhost:8080/private/room';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RoomResponse[]> {
    return this.http.get<RoomResponse[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<RoomResponse> {
    return this.http.get<RoomResponse>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getAvailable(): Observable<RoomResponse[]> {
    return this.http.get<RoomResponse[]>(`${this.apiUrl}/available`, { withCredentials: true });
  }

  create(request: RoomRequest): Observable<RoomResponse> {
    return this.http.post<RoomResponse>(this.apiUrl, request, { withCredentials: true });
  }

  update(id: number, request: RoomUpdateRequest): Observable<RoomResponse> {
    return this.http.put<RoomResponse>(`${this.apiUrl}/${id}`, request, { withCredentials: true });
  }

  setMaintenance(id: number): Observable<RoomResponse> {
    return this.http.patch<RoomResponse>(`${this.apiUrl}/${id}/maintenance`, {}, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`, { withCredentials: true });
  }
}