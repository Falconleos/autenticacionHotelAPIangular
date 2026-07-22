import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckInService } from '../../services/check-in.service';
import { UserService } from '../../services/user';
import { BookingDTOResponse } from '../../models/booking.model';
import { UserDtoResponse } from '../../models/user-response.model';

@Component({
  selector: 'app-check-in-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './check-in-modal.component.html',
  styleUrl: './check-in-modal.component.css'
})
export class CheckInModalComponent implements OnInit {
  private readonly checkInService = inject(CheckInService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  // Arrancamos directamente en el paso 2 si viene una reserva seleccionada
  step: number = 2;

  selectedBooking: BookingDTOResponse | null = null;

  guests: UserDtoResponse[] = [];
  guestFilter: string = '';
  selectedGuest: UserDtoResponse | null = null;

  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    // Recuperamos la reserva usando history.state de forma robusta
    const state = history.state as { selectedBooking?: BookingDTOResponse };

    if (state && state.selectedBooking) {
      this.selectedBooking = state.selectedBooking;
      this.loadGuests();
    } else {
      // Si por alguna razón ingresaron directo por URL sin reserva, los devolvemos al listado
      this.router.navigate(['/check-ins']);
    }
  }

  loadGuests(): void {
    this.isLoading = true;
    this.userService.getAll().subscribe({
      next: (users: UserDtoResponse[]) => {
        this.guests = users;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar usuarios:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredGuests(): UserDtoResponse[] {
    if (!this.guestFilter.trim()) return this.guests;
    const filter = this.guestFilter.toLowerCase();
    return this.guests.filter((g: UserDtoResponse) => 
      g.name.toLowerCase().includes(filter) || 
      g.surname.toLowerCase().includes(filter) || 
      g.dni.includes(filter)
    );
  }

  selectGuest(guest: UserDtoResponse): void {
    this.selectedGuest = guest;
    this.step = 3; // Pasamos al paso final de confirmación
  }

  goToCreateUser(): void {
  this.router.navigate(['/usuarios/crear']); 
  }

  confirmCheckIn(): void {
    if (!this.selectedBooking?.id || !this.selectedGuest?.id) return;

    const request = {
      bookingId: this.selectedBooking.id,
      userId: this.selectedGuest.id,
      total: this.selectedBooking.totalPrice ?? 0,
      paid: false
    };

    this.isLoading = true;
    this.checkInService.createCheckIn(request).subscribe({
      next: () => {
        alert('Check-In realizado con éxito.');
        this.router.navigate(['/check-ins']);
      },
      error: (err: any) => {
        console.error('Error al crear check-in:', err);
        alert('Error al procesar el check-in: ' + (err.error?.message || 'Verifique los datos'));
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/check-ins']);
  }
}