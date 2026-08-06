import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { DashboardComponent } from './components/dashboard-component/dashboard-component';
import { UserListComponent } from './components/user-list-component/user-list-component';
import { RoomListComponent } from './components/room-list-component/room-list-component';
import { EmployeeListComponent } from './components/employee-list-component/employee-list-component';
import { EmployeeFormComponent } from './components/employee-form-component/employee-form-component'; // <--- Importación del Formulario de Empleado
import { BookingListComponent } from './components/booking-list-component/booking-list-component';
import { CheckInListComponent } from './components/check-in-list-component/check-in-list-component';
import { ItemListComponent } from './components/item-list-component/item-list-component';
import { CommentListComponent } from './components/comment-list-component/comment-list-component';
import { AccountListComponent } from './components/account-list-component/account-list-component';
import { PaymentListComponent } from './components/payment-list-component/payment-list-component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'usuarios', component: UserListComponent },
      { path: 'rooms', component: RoomListComponent },
      { path: 'employees', component: EmployeeListComponent },
      { path: 'employees/nuevo', component: EmployeeFormComponent }, // <--- Ruta para crear empleado
      { path: 'bookings', component: BookingListComponent },
      { path: 'check-ins', component: CheckInListComponent },
      { path: 'items', component: ItemListComponent },
      { path: 'comments', component: CommentListComponent },
      { path: 'accounts', component: AccountListComponent },
      { path: 'payments', component: PaymentListComponent },
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];