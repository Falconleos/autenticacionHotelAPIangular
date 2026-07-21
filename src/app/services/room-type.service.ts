import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomTypeRequest, RoomTypeResponse } from '../models/room-type.model';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeService {

  private readonly apiUrl = 'http://localhost:8080/private/room-type';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RoomTypeResponse[]> {
    return this.http.get<RoomTypeResponse[]>(this.apiUrl, { withCredentials: true });
  }

  getById(id: number): Observable<RoomTypeResponse> {
    return this.http.get<RoomTypeResponse>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(request: RoomTypeRequest): Observable<RoomTypeResponse> {
    return this.http.post<RoomTypeResponse>(this.apiUrl, request, { withCredentials: true });
  }

  update(id: number, request: RoomTypeRequest): Observable<RoomTypeResponse> {
    return this.http.put<RoomTypeResponse>(`${this.apiUrl}/${id}`, request, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}