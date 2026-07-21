import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Welcome } from './components/welcome/welcome';
import { UsuariosComponent } from './components/usuarios/usuarios';
import { UsuarioForm } from './components/usuario-form/usuario-form'; 
import { RoomListComponent } from './components/room-list.component/room-list.component';
import { RoomFormComponent } from './components/room-form.component/room-form.component';
import { RoomTypeListComponent } from './components/room-type-list.component/room-type-list.component';
import { BookingListComponent } from './components/booking-list.component/booking-list.component'; // <-- Importar

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'welcome', component: Welcome },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'usuarios/crear', component: UsuarioForm },
  { path: 'usuarios/editar/:id', component: UsuarioForm },
  { 
    path: 'empleados', 
    loadComponent: () => import('./components/employees/employees').then(m => m.Employees) 
  }, 
  { 
    path: 'empleados/editar/:id', 
    loadComponent: () => import('./components/employee-form/employee-form').then(m => m.EmployeeForm) 
  },
  { 
    path: 'empleados/asignar/:userId', 
    loadComponent: () => import('./components/employee-form/employee-form').then(m => m.EmployeeForm) 
  },

  { path: 'habitaciones', component: RoomListComponent },
  { path: 'habitaciones/nueva', component: RoomFormComponent },
  { path: 'habitaciones/editar/:id', component: RoomFormComponent },
  { path: 'habitaciones/tipos', component: RoomTypeListComponent },

  // ======= RUTA DE RESERVAS AGREGADA =======
  { path: 'reservas', component: BookingListComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];