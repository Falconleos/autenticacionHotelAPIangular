export interface ItemDtoResponse {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ItemDtoRequest {
  description: string;
  quantity: number;
  unitPrice: number;
}