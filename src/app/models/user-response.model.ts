export interface UserDtoResponse {
  id: number;
  username: string;
  roles: RoleEntity[];
  name: string;
  surname: string;
  dni: string;
  email: string;
  phoneNumber: string;
  birthDay: string; // Llega como texto con formato ISO (YYYY-MM-DD)
  createAt: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
}

export interface RoleEntity {
  id: number;
  name: string; // Ej: 'ROLE_ADMIN', 'ROLE_RECEPCIONIST'
}