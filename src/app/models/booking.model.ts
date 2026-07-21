export interface BookingDTORequest {
  roomId: number;
  employeeId: number;
  checkIn: string;
  checkOut: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
  guestFirstName?: string;
  guestLastName?: string;
  guestName?: string;
  guestEmail?: string;
  guestPassport?: string;
  guestPhone?: string;
  customerType?: string;
  observation?: string;
}

export interface BookingDTOResponse {
  id?: number;
  checkIn?: string;
  checkOut?: string;
  checkInDate?: string;  // <--- Agregado por compatibilidad
  checkOutDate?: string; // <--- Agregado por compatibilidad
  guestCount?: number;
  totalPrice?: number;
  state?: BookingStatus | string;
  guestFirstName?: string;
  guestLastName?: string;
  guestPhone?: string;
  observation?: string;  // <--- Agregado para las observaciones
  room?: RoomDTOResponse;
  employee?: EmployeeDTOResponse;
  roomNumber?: string | number;
  employeeName?: string;
  active?: boolean;
  createdAt?: string;
}

export interface RoomDTOResponse {
  id?: number;
  roomNumber?: string | number;
  roomType?: string;
  description?: string;
  capacity?: number;
  pricePerNight?: number;
  [key: string]: any;
}

export interface EmployeeDTOResponse {
  id?: number;
  shift?: string;
  salary?: number;
  user?: {
    id?: number;
    name?: string;
    surname?: string;
    email?: string;
    dni?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export interface BookingCancellationDTORequest {
  reason?: string;
}

export interface BookingCancellationDTOResponse {
  success?: boolean;
  message?: string;
}