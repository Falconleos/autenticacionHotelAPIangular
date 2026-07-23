import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import { UserDtoResponse } from '../../models/user-response.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome implements OnInit {

  usersList: UserDtoResponse[] = [];
  errorMessage: string | null = null;

  // Variables para el usuario logueado en el navbar
  currentUserName: string = 'Usuario';
  currentUserRole: string = 'INVITADO';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        console.log('DATOS LLEGANDO AL COMPONENTE:', data);
        this.usersList = data;
        
        // --- AQUÍ ASIGNAMOS LOS DATOS DEL USUARIO LOGUEADO ---
        this.detectLoggedUser();
        // -----------------------------------------------------

        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar la lista de usuarios:', err);
        this.errorMessage = 'No se pudieron cargar los usuarios. Verificá tus permisos o tu sesión.';
      }
    });
  }

  detectLoggedUser(): void {
    const loggedUsername = localStorage.getItem('username');

    if (loggedUsername && this.usersList.length > 0) {
      const foundUser = this.usersList.find(u => u.username === loggedUsername);
      if (foundUser) {
        this.currentUserName = foundUser.name && foundUser.surname 
          ? `${foundUser.name} ${foundUser.surname}` 
          : foundUser.username;

        if (foundUser.roles && foundUser.roles.length > 0) {
          const rawRole = foundUser.roles[0].name;
          this.currentUserRole = rawRole.replace('ROLE_', '');
        }
      } else {
        // Respaldo por si el username del localStorage no coincide exactamente con la lista
        this.currentUserName = loggedUsername;
        this.currentUserRole = 'USUARIO';
      }
    } else if (this.usersList.length > 0) {
      const firstUser = this.usersList[0];
      this.currentUserName = firstUser.name ? `${firstUser.name} ${firstUser.surname}` : firstUser.username;
      if (firstUser.roles && firstUser.roles.length > 0) {
        this.currentUserRole = firstUser.roles[0].name.replace('ROLE_', '');
      }
    }
  }
}