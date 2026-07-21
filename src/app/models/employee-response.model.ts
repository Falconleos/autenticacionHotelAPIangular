import { UserDtoResponse } from './user-response.model';
import { Shift } from '../models/shift.enum';

export interface EmployeeDTOResponse {
  id: number;
  user: UserDtoResponse;
  shift: Shift;
  salary: number;
}