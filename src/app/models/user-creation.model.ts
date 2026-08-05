// src/app/models/user-creation.model.ts
import { RoleType } from './role.model';
import { UserDtoRequest } from './user.model';

export interface UserDtoRequestCreation extends UserDtoRequest {
  role: RoleType;
}