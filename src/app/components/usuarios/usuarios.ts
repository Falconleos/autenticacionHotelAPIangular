import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {
  usersList: any[] = [];
  filteredUsers: any[] = []; // <--- Agregamos esto
  errorMessage: string = '';

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
        this.usersList = data;
        this.filteredUsers = data; // <--- Inicializamos con todos los usuarios
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar los usuarios.';
      }
    });
  }

  // <--- Nuevo método para filtrar
  onFilter(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredUsers = this.usersList.filter(user => 
      user.name.toLowerCase().includes(searchTerm) || 
      user.dni.toString().includes(searchTerm)
    );
  }

  // <--- Métodos de acción (luego los conectaremos)
  editUser(id: number): void {
    console.log('Editar usuario:', id);
  }

  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar a este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          // Eliminamos el usuario de nuestras listas locales
          this.usersList = this.usersList.filter(u => u.id !== id);
          this.filteredUsers = this.filteredUsers.filter(u => u.id !== id);
          this.cdr.detectChanges();
          alert('Usuario eliminado correctamente');
        },
        error: (err) => {
          alert('Error al intentar eliminar el usuario');
          console.error(err);
        }
      });
    }
  }
}