export interface PaymentDTOResponse {
  id: number;
  accountId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionReference: string;
  userName?: string;
  userSurname?: string;
}

export interface PaymentDTORequest {
  accountId: number;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
}