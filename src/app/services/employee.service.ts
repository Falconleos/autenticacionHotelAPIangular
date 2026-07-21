import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeDTOResponse } from '../models/employee-response.model';
import { EmployeeDTORequest } from '../models/employee-request.model';
import { Shift } from '../models/shift.enum';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly API_URL = 'http://localhost:8080/private/employee';

  constructor(private http: HttpClient) { }

  // Obtener todos los empleados (solo Admin)
  getAll(): Observable<EmployeeDTOResponse[]> {
    return this.http.get<EmployeeDTOResponse[]>(this.API_URL, { withCredentials: true });
  }

  // Obtener un empleado por ID
  getById(id: number): Observable<EmployeeDTOResponse> {
    return this.http.get<EmployeeDTOResponse>(`${this.API_URL}/${id}`, { withCredentials: true });
  }

  // Crear perfil de empleado asociándolo a un usuario existente
  createEmployee(request: EmployeeDTORequest): Observable<EmployeeDTOResponse> {
    return this.http.post<EmployeeDTOResponse>(this.API_URL, request, { withCredentials: true });
  }

  // Actualizar datos laborales (turno y salario)
  updateEmployee(id: number, request: EmployeeDTORequest): Observable<EmployeeDTOResponse> {
    return this.http.put<EmployeeDTOResponse>(`${this.API_URL}/${id}`, request, { withCredentials: true });
  }

  // Cambiar solo el turno
  cambiarTurno(id: number, nuevoShift: Shift): Observable<EmployeeDTOResponse> {
    return this.http.patch<EmployeeDTOResponse>(
      `${this.API_URL}/${id}/shift?nuevoShift=${nuevoShift}`, 
      {}, 
      { withCredentials: true }
    );
  }

  // Eliminar el perfil de empleado (sin borrar el usuario)
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, { withCredentials: true });
  }
}