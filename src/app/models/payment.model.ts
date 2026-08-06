export interface PaymentDtoResponse {
  id: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionReference: string;
  accountId: number;
  
  // Opcional para mostrar en la lista de pagos vinculada al usuario/cuenta
  userName?: string;
  userSurname?: string;
}