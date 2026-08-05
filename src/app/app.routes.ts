import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { DashboardComponent } from './components/dashboard-component/dashboard-component';
import { UserListComponent } from './components/user-list-component/user-list-component'; // <--- Importa tu componente
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      // Ruta para listar usuarios: se accederá mediante /dashboard/usuarios
      { path: 'usuarios', component: UserListComponent },
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];