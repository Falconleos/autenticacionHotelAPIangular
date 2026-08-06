export type RoomState = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | string; // Ajusta según tus enums de Java

export interface RoomDtoResponse {
  id: number;
  number: number;
  state: RoomState;
  roomTypeId: number;
  roomTypeName: string;
  capacity: number;
  pricePerNight: number;
}