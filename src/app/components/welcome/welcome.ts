import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- Importá ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import { UserDtoResponse } from '../../models/user-response.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export class Welcome implements OnInit {

  usersList: UserDtoResponse[] = [];
  errorMessage: string | null = null;

  // Inyectá ChangeDetectorRef en el constructor
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
        
        // Forzamos a Angular a redibujar el HTML con el nuevo arreglo lleno
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar la lista de usuarios:', err);
        this.errorMessage = 'No se pudieron cargar los usuarios. Verificá tus permisos o tu sesión.';
      }
    });
  }
}