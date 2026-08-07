import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CheckInService } from '../../services/check-in-service';
import { CheckInDtoResponse } from '../../models/check-in.model';
import { BookingDtoResponse } from '../../models/booking.model';
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
  pendingBookingsToday: BookingDtoResponse[] = [];
  loading = true;
  errorMessage = '';
  canModify = false;

  constructor(
    private checkInService: CheckInService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadData();
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

  loadData(): void {
    this.loading = true;
    this.errorMessage = '';
    
    // 1. Cargamos todos los check-ins existentes
    this.checkInService.getAll().subscribe({
      next: (checkInsData) => {
        this.checkIns = Array.isArray(checkInsData) ? [...checkInsData] : [];
        
        // 2. Cargamos las reservas programadas para hoy desde el backend
        this.checkInService.getTodayCheckIns().subscribe({
          next: (todayBookings) => {
            const activeBookingIdsWithCheckIn = new Set(
              this.checkIns.map(c => c.booking?.id).filter(id => id != null)
            );

            // Filtramos las que todavía no tienen un check-in creado
            this.pendingBookingsToday = (Array.isArray(todayBookings) ? todayBookings : []).filter(
              b => !activeBookingIdsWithCheckIn.has(b.id)
            );

            this.loading = false;
            this.cdr.markForCheck();
          },
          error: () => {
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar las estadías en curso o no cuentas con los permisos necesarios.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error(err);
      }
    });
  }

  goToCreateCheckIn(booking: any): void {
    // Intentamos extraer el ID de usuario de distintas propiedades comunes por seguridad
    const userId = booking.user?.id || booking.userId || booking.guest?.id;

    // Redirige al formulario pasando el ID de reserva y de usuario por queryParams
    this.router.navigate(['/dashboard/check-ins/nuevo'], { 
      queryParams: { 
        bookingId: booking.id, 
        userId: userId 
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