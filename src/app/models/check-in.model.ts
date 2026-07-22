import { BookingDTOResponse } from './booking.model';
import { UserDtoResponse } from './user-response.model'; // O asegúrate de importar tu modelo de usuario existente
import { EmployeeDTOResponse } from './employee-response.model'; // O tu modelo de empleado existente

export enum CheckInState {
  CURRENTLY_ACTIVE = 'CURRENTLY_ACTIVE',
  COMPLETED = 'COMPLETED',
  INTERRUPTED = 'INTERRUPTED'
}

export interface CheckInDTORequest {
  bookingId: number;
  userId: number;
  total: number;
  paid: boolean;
}

export interface CheckInDTOResponse {
  id: number;
  booking: BookingDTOResponse;
  user: UserDtoResponse;
  employee: EmployeeDTOResponse;
  checkInState: CheckInState;
  total: number;
  paid: boolean;
  active: boolean;
}