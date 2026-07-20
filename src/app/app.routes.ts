import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Welcome } from './components/welcome/welcome';

export const routes: Routes = [
    {path:'login',component:Login},
    {path:'welcome',component:Welcome},
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'**',redirectTo:'login'}
];
