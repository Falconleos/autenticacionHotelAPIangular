export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  CHECKED_IN = 'CHECKED_IN',
  INTERRUPTED = 'INTERRUPTED',
  CONCLUDED = 'CONCLUDED'
}

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE'
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
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

export interface BookingDTOResponse {
  id?: number;
  checkIn?: string;
  checkOut?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
  state?: BookingStatus;
  guestFirstName?: string;
  guestLastName?: string;
  guestPhone?: string;
  observation?: string;
  employee?: EmployeeDTOResponse;
  employeeId?: number;
  employeeName?: string;
  room?: RoomDTOResponse;
  roomNumber?: string | number;
  totalPrice?: number;
  active?: boolean;
  createdAt?: string;
}

export interface BookingDTORequest {
  roomId: number;
  guestName?: string;
  guestLastName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestPassport?: string;
  customerType?: CustomerType;
  checkIn?: string;
  checkOut?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCount: number;
  observation?: string;
}

export interface BookingCancellationDTORequest {
  bookingId: number;
  reason?: string;
}

export interface BookingCancellationDTOResponse {
  id?: number;
  success?: boolean;
  message?: string;
}