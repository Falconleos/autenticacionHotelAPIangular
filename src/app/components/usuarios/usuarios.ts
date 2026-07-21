import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user'; 
import { AuthService } from '../../services/auth.service';
import { RouterLink, Router } from '@angular/router'; // <--- Importamos Router
import { ErrorDTOResponse } from '../../models/error-response.model';
import { UserDtoResponse } from '../../models/user-response.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {
  usersList: any[] = [];
  filteredUsers: any[] = [];
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router // <--- Inyectamos Router aquí
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Verifica si el usuario logueado puede crear nuevos usuarios
  canCreateUser(): boolean {
    return this.authService.canCreateUser();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.usersList = data;
        this.filteredUsers = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar los usuarios.';
      }
    });
  }

  onFilter(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredUsers = this.usersList.filter(user => 
      user.name.toLowerCase().includes(searchTerm) || 
      user.dni.toString().includes(searchTerm)
    );
  }

  // <--- Redirigimos a la ruta de edición con el ID correspondiente
  editUser(id: number): void {
    this.router.navigate(['/usuarios/editar', id]);
  }

  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar a este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.usersList = this.usersList.filter(u => u.id !== id);
          this.filteredUsers = this.filteredUsers.filter(u => u.id !== id);
          this.cdr.detectChanges();
          alert('Usuario eliminado correctamente.');
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          
          // Mapeamos el cuerpo del error con la interfaz ErrorDTOResponse
          const apiError = err.error as ErrorDTOResponse;
          const userMessage = apiError?.mensaje || 'No se pudo eliminar el usuario.';
          
          alert(userMessage);
        }
      });
    }
  }

  changePassword(id: number): void {
  const newPassword = prompt('Ingresa la nueva contraseña para el usuario (mínimo 6 caracteres):');

  if (!newPassword) {
    // Si cancela o deja vacío
    return;
  }

  if (newPassword.trim().length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres.');
    return;
  }

  this.userService.resetPassword(id, newPassword.trim()).subscribe({
    next: () => {
      alert('Contraseña actualizada con éxito.');
    },
    error: (err) => {
      console.error('Error al cambiar contraseña:', err);
      const apiError = err.error;
      const userMessage = apiError?.mensaje || 'No se pudo actualizar la contraseña.';
      alert(userMessage);
    }
  });
}

canChangePasswordFor(user: UserDtoResponse): boolean {
  // Si el usuario es Recepcionista y el usuario objetivo es ADMIN, retorne false
  const isTargetAdmin = user.roles?.some(role => role.name === 'ROLE_ADMIN' || role.name === 'ADMIN');
  
  if (this.authService.isRecepcionist() && isTargetAdmin) {
    return false;
  }
  
  return true;
}

}