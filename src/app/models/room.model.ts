import { RoomState } from './room-state.enum';

export interface RoomRequest {
  number: number;
  roomTypeId: number;
}

export interface RoomUpdateRequest {
  number: number;
  roomTypeId: number;
}

export interface RoomResponse {
  id: number;
  number: number;
  state: RoomState;
  roomTypeId: number;
  roomTypeName: string;
  capacity: number;
  pricePerNight: number;
}