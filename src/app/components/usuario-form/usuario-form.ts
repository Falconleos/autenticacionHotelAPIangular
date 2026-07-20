import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDtoResponse } from '../../models/user-response.model'; // Importamos el nuevo modelo
import { UserService } from '../../services/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioForm {
  newUser = {
    username: '',
    password: '',
    name: '',
    surname: '',
    dni: '',
    email: '',
    phoneNumber: '',
    birthDay: '',
    role: 'GUEST'
  };

  // 1. Inyectamos el servicio aquí
  constructor(private userService: UserService,
    private router: Router
  ) {}

  saveUser() {
    console.log('Datos a enviar:', this.newUser);
    
    // 2. Llamamos al método del servicio
    this.userService.createUser(this.newUser).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        alert('Usuario guardado exitosamente');
        // 3. Redirige a la ruta definida en tu app.routes.ts
        this.router.navigate(['/usuarios']);
      },
      error: (error) => {
        console.error('Error al guardar:', error);
        alert('Error al guardar el usuario. Revisa la consola.');
      }
    });
  }
}