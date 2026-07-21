export interface RoomTypeRequest {
  name: string;
  capacity: number;
  description: string;
  pricePerNight: number;
}

export interface RoomTypeResponse {
  id: number;
  name: string;
  capacity: number;
  description: string;
  pricePerNight: number;
}