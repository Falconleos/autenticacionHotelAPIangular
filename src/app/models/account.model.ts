export interface AccountDTOResponse {
  id: number;
  checkInId: number;
  totalAmount: number;
  paidAmount: number;
  remainingBalance?: number;
  isPaid: boolean;
  payments: any[]; // O tu interfaz de pago correspondiente
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