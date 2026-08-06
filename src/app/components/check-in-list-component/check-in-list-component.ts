import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CheckInService } from '../../services/check-in-service';
import { CheckInDtoResponse } from '../../models/check-in.model';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-check-in-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './check-in-list-component.html',
  styleUrls: ['./check-in-list-component.css']
})
export class CheckInListComponent implements OnInit {
  checkIns: CheckInDtoResponse[] = [];
  loading = true;
  errorMessage = '';
  canModify = false; // Permite acceso a Admin y Recepcionista

  constructor(
    private checkInService: CheckInService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadCheckIns();
  }

  checkUserRole(): void {
    const storedRoles = localStorage.getItem('role');
    if (storedRoles) {
      try {
        const roles = JSON.parse(storedRoles);
        if (Array.isArray(roles)) {
          this.canModify = roles.some((r: any) => {
            const val = typeof r === 'string' ? r : (r.authority || '');
            return val === 'ADMIN' || val === 'ROLE_ADMIN' || val === 'RECEPCIONIST' || val === 'ROLE_RECEPCIONIST';
          });
        } else {
          const val = typeof roles === 'string' ? roles : '';
          this.canModify = val === 'ADMIN' || val === 'ROLE_ADMIN' || val === 'RECEPCIONIST' || val === 'ROLE_RECEPCIONIST';
        }
      } catch (e) {
        this.canModify = storedRoles.includes('ADMIN') || storedRoles.includes('RECEPCIONIST');
      }
    } else {
      this.canModify = false;
    }
  }

  loadCheckIns(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.checkInService.getAll().subscribe({
      next: (data) => {
        this.checkIns = Array.isArray(data) ? [...data] : [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar las estadías en curso o no cuentas con los permisos necesarios.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error(err);
      }
    });
  }

  interruptPlaceholder(id: number): void {
    if (!this.canModify) {
      alert('No tienes los permisos necesarios para realizar esta acción.');
      return;
    }
    alert(`Acción "Interrumpir" presionada para la estadía ID: ${id}`);
  }

  viewAccountPlaceholder(id: number): void {
    alert(`Acción "Ver cuenta" presionada para la estadía ID: ${id}`);
  }

  servicesPlaceholder(id: number): void {
    alert(`Acción "Servicios" presionada para la estadía ID: ${id}`);
  }
}