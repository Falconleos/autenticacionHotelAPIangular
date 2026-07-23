import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDTOResponse } from '../../models/employee-response.model';
import { UserService } from '../../services/user';
import { UserDtoResponse } from '../../models/user-response.model';

// Interfaz para unificar la fila en la tabla
export interface EmployeeRowItem {
  userId: number;
  employeeId: number | null; // null si aún no es empleado
  name: string;
  surname: string;
  dni: string;
  email: string;
  role: string;
  shift: string | null;
  salary: number | null;
  isEmployee: boolean; // true si ya tiene perfil de empleado
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees implements OnInit {

  tableRows: EmployeeRowItem[] = [];
  errorMessage: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Usamos forkJoin para pedir ambas cosas en paralelo de forma limpia
    forkJoin({
      employees: this.employeeService.getAll(),
      users: this.userService.getAll()
    }).subscribe({
      next: ({ employees, users }) => {
        console.log('Listado de empleados cargados desde API:', employees);
        console.log('Listado de usuarios cargados desde API:', users);

        this.buildTableRows(employees, users);
        this.cdr.detectChanges(); // Forzamos a Angular a re-renderizar la tabla
      },
      error: (err) => {
        console.error('Error al cargar datos en la tabla:', err);
        this.errorMessage = 'No se pudieron cargar los datos de empleados/usuarios.';
      }
    });
  }

  private buildTableRows(employees: EmployeeDTOResponse[], users: UserDtoResponse[]): void {
    const employeeMap = new Map<number, EmployeeDTOResponse>();
    
    // Mapeo robusto: busca userId directo o dentro del objeto user
    employees.forEach(emp => {
      const targetUserId = emp.user?.id || (emp as any).userId;
      if (targetUserId) {
        employeeMap.set(targetUserId, emp);
      }
    });

    // Filtrar usuarios que NO sean GUEST
    const nonGuestUsers = users.filter(user => 
      !user.roles?.some(role => role.name?.replace('ROLE_', '').toUpperCase() === 'GUEST')
    );

    // Mapear la lista unificada
    this.tableRows = nonGuestUsers.map(user => {
      const emp = employeeMap.get(user.id);

      // Obtenemos el nombre formateado del rol
      const firstRole = user.roles && user.roles.length > 0 ? user.roles[0].name : '';
      const userRole = firstRole ? firstRole.replace('ROLE_', '').toUpperCase() : 'SIN ROL';
      
      if (emp) {
        // Usuario que YA es empleado
        return {
          userId: user.id,
          employeeId: emp.id,
          name: user.name,
          surname: user.surname,
          dni: user.dni,
          email: user.email,
          role: userRole,
          shift: emp.shift,
          salary: emp.salary,
          isEmployee: true
        };
      } else {
        // Usuario no GUEST que AÚN NO es empleado
        return {
          userId: user.id,
          employeeId: null,
          name: user.name,
          surname: user.surname,
          dni: user.dni,
          email: user.email,
          role: userRole,
          shift: null,
          salary: null,
          isEmployee: false
        };
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/welcome']); // Cambia '/dashboard' por la ruta correcta de tu panel principal
  }

  assignJob(userId: number): void {
    this.router.navigate(['/empleados/asignar', userId]);
  }

  editEmployee(employeeId: number): void {
    this.router.navigate(['/empleados/editar', employeeId]);
  }

  editUser(userId: number): void {
    this.router.navigate(['/usuarios/editar', userId]);
  }

  deleteEmployee(employeeId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este perfil de empleado?')) {
      this.employeeService.deleteEmployee(employeeId).subscribe({
        next: () => {
          alert('Perfil de empleado eliminado con éxito');
          this.loadData();
        },
        error: (err) => {
          console.error('Error al eliminar empleado:', err);
          const msg = err?.error?.message || err?.error || 'No se pudo eliminar el empleado ya que tiene registros/reservas asociados.';
          alert(msg);
        }
      });
    }
  }
}