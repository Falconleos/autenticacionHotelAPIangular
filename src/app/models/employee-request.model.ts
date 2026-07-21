import { Shift } from '../models/shift.enum';

export interface EmployeeDTORequest {
  userId: number;
  shift: Shift;
  salary: number;
}