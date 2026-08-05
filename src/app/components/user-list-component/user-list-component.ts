import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { UserDtoResponse } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list-component.html',
  styleUrls: ['./user-list-component.css']
})
export class UserListComponent implements OnInit {
  users: UserDtoResponse[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = Array.isArray(data) ? [...data] : [];
        this.loading = false;
        this.cdr.markForCheck(); // Fuerza la actualización de la vista
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar los usuarios o no cuentas con los permisos necesarios.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error(err);
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
          this.cdr.markForCheck();
        },
        error: (err) => {
          alert('Error al eliminar el usuario. Recuerda que esta acción requiere rol ADMIN.');
          console.error(err);
        }
      });
    }
  }
}