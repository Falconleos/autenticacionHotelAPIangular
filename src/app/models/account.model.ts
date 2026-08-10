import { PaymentDTOResponse } from './payment.model';

export interface AccountDTOResponse {
  id: number;
  checkInId: number;
  totalAmount: number;
  paidAmount: number;
  remainingBalance?: number;
  isPaid: boolean;
  payments: PaymentDTOResponse[]; // <-- Cambiado de any[] a PaymentDTOResponse[]
  user?: {
    name: string;
    surname: string;
    dni: string;
  };
  roomNumber?: string | number;
  checkInDate?: string;
  checkOutDate?: string;
  items?: {
    description: string;
    quantity: number;
    subtotal: number;
  }[];
}