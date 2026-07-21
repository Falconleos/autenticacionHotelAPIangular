import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Welcome } from './components/welcome/welcome';
import { UsuariosComponent } from './components/usuarios/usuarios';
import { UsuarioForm } from './components/usuario-form/usuario-form'; 

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
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];