import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { BookingDTOResponse, BookingStatus } from '../../models/booking.model';
import { BookingAvailabilityModalComponent } from '../booking-availability-modal.component/booking-availability-modal.component';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, FormsModule,BookingAvailabilityModalComponent],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.css'
})
export class BookingListComponent implements OnInit {
  private readonly bookingService = inject(BookingService);

  // Lista original del backend y lista filtrada para la vista
  bookings: BookingDTOResponse[] = [];
  filteredBookings: BookingDTOResponse[] = [];

  // Estados de carga y error
  isLoading: boolean = false;
  errorMessage: string = '';

  // Filtros de búsqueda local
  filterRoomNumber: string = '';
  filterEmployeeName: string = '';
  filterCheckInDate: string = '';
  filterCheckOutDate: string = '';
  filterActive: boolean | string = 'ALL'; // 'ALL', true, false

  // Control para abrir el modal de disponibilidad / alta (siguiente paso)
  showAvailabilityModal: boolean = false;

  ngOnInit(): void {
    this.loadBookings();
  }

  /**
   * Carga inicial de reservas desde el backend
   */
  loadBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Si filterActive es 'ALL', pasamos undefined para traer todas
    const activeParam = this.filterActive === 'ALL' ? undefined : (this.filterActive as boolean);

    this.bookingService.getBookings(activeParam).subscribe({
      next: (data) => {
        this.bookings = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.errorMessage = 'No se pudieron cargar las reservas. Intente nuevamente.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Aplica los filtros locales (Habitación, Empleado, Fechas)
   */
  applyFilters(): void {
    this.filteredBookings = this.bookings.filter(b => {
      // 1. Número de habitación desde el objeto 'room' anidado o la propiedad directa
      const roomNum = b.room?.roomNumber?.toString() || b.roomNumber?.toString() || '';
      const matchesRoom = !this.filterRoomNumber || 
        roomNum.toLowerCase().includes(this.filterRoomNumber.toLowerCase().trim());

      // 2. Nombre del empleado desde el objeto 'employee' anidado o la propiedad directa
      const empFirstName = b.employee?.firstName || '';
      const empLastName = b.employee?.lastName || '';
      const fullEmpName = `${empFirstName} ${empLastName}`.trim() || b.employeeName || '';
      
      const matchesEmployee = !this.filterEmployeeName || 
        fullEmpName.toLowerCase().includes(this.filterEmployeeName.toLowerCase().trim());

      // 3. Rango de fechas asegurando string no undefined para TypeScript
      const bookingCheckIn = b.checkIn || b.checkInDate || '';
      const bookingCheckOut = b.checkOut || b.checkOutDate || '';

      const matchesCheckIn = !this.filterCheckInDate || bookingCheckIn >= this.filterCheckInDate;
      const matchesCheckOut = !this.filterCheckOutDate || bookingCheckOut <= this.filterCheckOutDate;

      return matchesRoom && matchesEmployee && matchesCheckIn && matchesCheckOut;
    });
  }

  /**
   * Limpia todos los filtros y reinicia la lista
   */
  resetFilters(): void {
    this.filterRoomNumber = '';
    this.filterEmployeeName = '';
    this.filterCheckInDate = '';
    this.filterCheckOutDate = '';
    this.filterActive = 'ALL';
    this.loadBookings();
  }

  /**
   * Acción para confirmar una reserva PENDING
   */
  confirmBooking(id: number): void {
    if (confirm('¿Está seguro de confirmar esta reserva?')) {
      this.bookingService.confirmBooking(id).subscribe({
        next: () => this.loadBookings(),
        error: (err) => alert('Error al confirmar la reserva.')
      });
    }
  }

  /**
   * Devuelve clases de estilo según el estado de la reserva
   */
  getStatusBadgeClass(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.CONFIRMED: return 'badge-success';
      case BookingStatus.PENDING: return 'badge-warning';
      case BookingStatus.CANCELLED: return 'badge-danger';
      case BookingStatus.NO_SHOW: return 'badge-secondary';
      default: return 'badge-info';
    }
  }

  openAvailabilityModal(): void {
    this.showAvailabilityModal = true;
  }
}