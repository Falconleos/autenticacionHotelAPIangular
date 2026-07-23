import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // <--- Asegúrate de tener RouterLink aquí
import { BookingService } from '../../services/booking.service';
import { CheckInService } from '../../services/check-in.service';
import { BookingDTOResponse } from '../../models/booking.model';
import { CheckInDTOResponse } from '../../models/check-in.model';

@Component({
  selector: 'app-check-in-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // <--- RouterLink incluido
  templateUrl: './check-in-list.component.html',
  styleUrl: './check-in-list.component.css'
})
export class CheckInListComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly checkInService = inject(CheckInService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  todaysBookings: BookingDTOResponse[] = [];
  activeCheckIns: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.loadTodaysBookings();
    this.loadActiveCheckIns();
  }

  loadTodaysBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        const today = new Date().toISOString().split('T')[0];
        this.todaysBookings = bookings.filter(b => b.checkIn === today && b.state === 'CONFIRMED');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar reservas del día:', err);
        this.errorMessage = 'No se pudieron cargar las reservas de ingreso para hoy.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadActiveCheckIns(): void {
    this.checkInService.list(true).subscribe({
      next: (data: CheckInDTOResponse[]) => {
        this.activeCheckIns = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar check-ins activos:', err);
      }
    });
  }

  makeCheckIn(booking: BookingDTOResponse): void {
    this.router.navigate(['/check-ins/new'], { state: { selectedBooking: booking } });
  }

  payCheckIn(id: number): void {
    if (confirm('¿Desea registrar el pago de esta estadía?')) {
      this.checkInService.payStay(id).subscribe({
        next: () => {
          alert('Pago registrado exitosamente');
          this.loadActiveCheckIns();
        },
        error: (err) => {
          console.error('Error al registrar el pago:', err);
          alert('No se pudo registrar el pago.');
        }
      });
    }
  }

  interruptCheckIn(id: number): void {
    const reason = prompt('Por favor, ingrese el motivo de la interrupción del check-in:');
    if (reason !== null && reason.trim() !== '') {
      this.checkInService.interruptStay(id, reason).subscribe({
        next: () => {
          alert('Estadía interrumpida exitosamente.');
          this.loadActiveCheckIns();
        },
        error: (err: any) => {
          console.error('Error al interrumpir la estadía:', err);
          alert('No se pudo interrumpir la estadía.');
        }
      });
    } else if (reason !== null) {
      alert('Debe ingresar un motivo obligatorio.');
    }
  }

  checkOutCheckIn(id: number): void {
    if (confirm('¿Desea realizar el Check-Out de esta estadía?')) {
      this.checkInService.checkOut(id).subscribe({
        next: () => {
          alert('Check-Out realizado exitosamente.');
          this.loadActiveCheckIns();
        },
        error: (err: any) => {
          console.error('Error al realizar el check-out:', err);
          alert('No se pudo realizar el check-out.');
        }
      });
    }
  }
}