import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { UserService } from '../../services/user';
import { Shift } from '../../models/shift.enum';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.html'
})
export class EmployeeForm implements OnInit {

  userId: number | null = null;
  employeeId: number | null = null;
  isAssignMode: boolean = false;
  
  // Datos informativos del usuario (solo lectura)
  userFullName: string = '';
  userEmail: string = '';
  userRole: string = '';

  // Campos modificables
  shift: Shift = Shift.MORNING;
  salary: number = 0;

  // Lista de turnos tomados desde el Enum
  shifts: Shift[] = Object.values(Shift);

  constructor(
    private employeeService: EmployeeService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const assignUserIdParam = this.route.snapshot.paramMap.get('userId');
    const editIdParam = this.route.snapshot.paramMap.get('id');

    if (assignUserIdParam) {
      this.isAssignMode = true;
      this.userId = +assignUserIdParam;
      this.loadUserDataForAssign(this.userId);
    } else if (editIdParam) {
      this.isAssignMode = false;
      this.employeeId = +editIdParam;
      this.loadEmployeeDataForEdit(this.employeeId);
    }
  }

  private extractRoleName(user: any): string {
    const firstRole = user?.roles && user.roles.length > 0 ? user.roles[0].name : '';
    return firstRole ? firstRole.replace('ROLE_', '').toUpperCase() : 'SIN ROL';
  }

  loadUserDataForAssign(userId: number): void {
    this.userService.getById(userId).subscribe({
      next: (user) => {
        this.userFullName = `${user.name} ${user.surname}`;
        this.userEmail = user.email || '';
        this.userRole = this.extractRoleName(user);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar datos del usuario:', err);
        alert('No se pudieron obtener los datos del usuario.');
        this.router.navigate(['/empleados']);
      }
    });
  }

  loadEmployeeDataForEdit(employeeId: number): void {
    this.employeeService.getById(employeeId).subscribe({
      next: (emp: any) => {
        console.log('Datos recibidos al editar empleado:', emp);

        this.shift = emp.shift;
        this.salary = emp.salary;

        if (emp.user && emp.user.id) {
          this.userId = emp.user.id;
          this.userFullName = `${emp.user.name || ''} ${emp.user.surname || ''}`.trim();
          this.userEmail = emp.user.email || '';
          this.userRole = this.extractRoleName(emp.user);
          this.cdr.detectChanges();
        } else {
          const targetUserId = emp.userId || emp.user?.id;
          if (targetUserId) {
            this.userId = targetUserId;
            this.userService.getById(targetUserId).subscribe({
              next: (u) => {
                this.userFullName = `${u.name} ${u.surname}`;
                this.userEmail = u.email || '';
                this.userRole = this.extractRoleName(u);
                this.cdr.detectChanges();
              }
            });
          }
        }
      },
      error: (err) => {
        console.error('Error al cargar empleado:', err);
        alert('No se pudieron obtener los datos del empleado.');
        this.router.navigate(['/empleados']);
      }
    });
  }

  saveEmployee(): void {
    if (!this.userId) {
      alert('Error: No se encontró el ID de usuario asociado.');
      return;
    }

    const request = {
      userId: Number(this.userId),
      shift: this.shift,
      salary: Number(this.salary)
    };

    console.log('Payload enviado a API:', request);

    if (this.isAssignMode) {
      this.employeeService.createEmployee(request).subscribe({
        next: () => {
          alert('Empleo asignado exitosamente');
          this.router.navigate(['/empleados']);
        },
        error: (err) => {
          console.error('Error al asignar empleo:', err);
          alert('Ocurrió un error al intentar asignar el empleo.');
        }
      });
    } else {
      if (!this.employeeId) return;
      this.employeeService.updateEmployee(this.employeeId, request).subscribe({
        next: (res) => {
          console.log('Respuesta de actualización exitosa:', res);
          alert('Empleado actualizado correctamente');
          this.router.navigate(['/empleados']);
        },
        error: (err) => {
          console.error('Error al actualizar empleado:', err);
          alert('Ocurrió un error al intentar actualizar el empleado.');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/empleados']);
  }
}