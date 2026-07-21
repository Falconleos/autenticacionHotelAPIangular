import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth.service'; // <--- Importamos AuthService
import { UserFormModel } from '../../models/user-form.model';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioForm implements OnInit {
  userId: number | null = null;
  isEditMode: boolean = false;

  // Lista base de roles
  allRoles: { label: string; value: UserFormModel['role'] }[] = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Recepcionista', value: 'RECEPCIONIST' },
    { label: 'Mantenimiento de Limpieza (Housekeeping)', value: 'HOUSEKEEPING' },
    { label: 'Mantenimiento General', value: 'MAINTENANCE' },
    { label: 'Personal de Refuerzo', value: 'RELIEF_STAFF' },
    { label: 'Huésped', value: 'GUEST' }
  ];

  // Roles filtrados disponibles para el desplegable
  availableRoles: { label: string; value: UserFormModel['role'] }[] = [];

  newUser: UserFormModel = {
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

  constructor(
    private userService: UserService,
    private authService: AuthService, // <--- Inyectamos AuthService
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.filterAvailableRoles();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = +idParam;
      this.isEditMode = true;
      this.loadUserData(this.userId);
    }
  }

  // Filtra la lista para que si es RECEPCIONIST no pueda ver ni seleccionar ADMIN
  filterAvailableRoles(): void {
    if (this.authService.isRecepcionist()) {
      this.availableRoles = this.allRoles.filter(role => role.value !== 'ADMIN');
    } else {
      this.availableRoles = [...this.allRoles];
    }
  }

  loadUserData(id: number): void {
    this.userService.getById(id).subscribe({
      next: (user) => {
        const currentRole = user.roles && user.roles.length > 0 
          ? (user.roles[0].name.replace('ROLE_', '') as UserFormModel['role'])
          : 'GUEST';

        this.newUser = {
          username: user.username,
          password: '',
          name: user.name,
          surname: user.surname,
          dni: user.dni,
          email: user.email,
          phoneNumber: user.phoneNumber,
          birthDay: user.birthDay,
          role: currentRole
        };
      },
      error: (err) => {
        console.error('Error al recuperar datos del usuario:', err);
        alert('No se pudieron recuperar los datos del usuario.');
      }
    });
  }

  saveUser(): void {
    if (this.isEditMode && this.userId) {
      this.userService.updateUser(this.userId, this.newUser).subscribe({
        next: () => {
          alert('Usuario actualizado exitosamente');
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          alert('Error al actualizar el usuario.');
        }
      });
    } else {
      this.userService.createUser(this.newUser).subscribe({
        next: () => {
          alert('Usuario guardado exitosamente');
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          console.error('Error al guardar:', error);
          alert('Error al guardar el usuario.');
        }
      });
    }
  }
}