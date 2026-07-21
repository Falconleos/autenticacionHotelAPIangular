export interface UserFormModel {
  username: string;
  password?: string;
  name: string;
  surname: string;
  dni: string;
  email: string;
  phoneNumber: string;
  birthDay: string;
  role: 'ADMIN' | 'RECEPCIONIST' | 'HOUSEKEEPING' | 'MAINTENANCE' | 'RELIEF_STAFF' | 'GUEST';
}