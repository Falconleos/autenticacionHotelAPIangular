import { PaymentDtoResponse } from './payment.model';
import { UserDtoResponse } from './user.model';

export interface AccountDtoResponse {
  id: number;
  checkInId: number;
  totalAmount: number;
  paidAmount: number;
  remainingBalance: number;
  isPaid: boolean;
  payments: PaymentDtoResponse[];

  // Propiedades complementarias de la estadía/check-in para mostrar en la vista
  user?: UserDtoResponse;
  roomNumber?: number;
  checkInDate?: string;
  checkOutDate?: string;
}