import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CheckInService } from '../../services/check-in-service';
import { UserService } from '../../services/user-service'; // Asegúrate que la ruta sea correcta

@Component({
  selector: 'app-check-in-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './check-in-create-component.html',
  styleUrls: ['./check-in-create-component.css']
})
export class CheckInCreateComponent implements OnInit {
  bookingId: number | null = null;
  userId: number | null = null;
  selectedGuestName: string = '';
  
  guests: any[] = [];
  checkInDate: string = '';
  checkOutDate: string = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkInService: CheckInService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    this.route.queryParams.subscribe(params => {
      if (params['bookingId']) {
        this.bookingId = +params['bookingId'];
        this.loadBookingDetails(this.bookingId);
      }
      if (params['userId']) {
        this.userId = +params['userId'];
      }
    });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (users: any[]) => {
        this.guests = Array.isArray(users) ? users : [];
      },
      error: (err: any) => {
        console.error('Error al cargar la lista de usuarios', err);
        this.errorMessage = 'No se pudo cargar la lista de usuarios desde el servidor.';
      }
    });
  }

  loadBookingDetails(id: number): void {
    this.checkInService.getBookingById(id).subscribe({
      next: (booking: any) => {
        if (booking) {
          this.checkInDate = booking.checkInDate || booking.checkIn || booking.startDate || '';
          this.checkOutDate = booking.checkOutDate || booking.checkOut || booking.endDate || '';
          
          if (!this.userId && booking.user?.id) {
            this.userId = booking.user.id;
            this.selectedGuestName = `${booking.user.name || ''} ${booking.user.surname || ''}`;
          }
        }
      },
      error: (err: any) => {
        console.error('No se pudieron cargar los detalles de la reserva', err);
        this.errorMessage = 'Error al obtener los datos de la reserva.';
      }
    });
  }

  selectGuest(guest: any): void {
    this.userId = guest.id;
    this.selectedGuestName = `${guest.name || ''} ${guest.surname || ''}`;
  }

  onSubmit(): void {
    if (!this.bookingId || !this.userId) {
      this.errorMessage = 'Debe seleccionar un huésped de la lista y tener una reserva válida.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request = {
      bookingId: this.bookingId,
      userId: this.userId
    };

    this.checkInService.createCheckIn(request).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = '¡Check-In registrado con éxito!';
        setTimeout(() => {
          this.router.navigate(['/dashboard/check-ins']);
        }, 1500);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = 'Error al registrar el Check-In en el servidor.';
        console.error(err);
      }
    });
  }
}