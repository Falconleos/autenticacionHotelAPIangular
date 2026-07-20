import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Welcome } from './components/welcome/welcome';
import { UsuariosComponent } from './components/usuarios/usuarios';
import { UsuarioForm } from './components/usuario-form/usuario-form'; // Asegurate que el nombre del archivo sea correcto

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'welcome', component: Welcome },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'usuarios/crear', component: UsuarioForm },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];