import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { BookingDTOResponse, BookingStatus } from '../../models/booking.model';
import { BookingAvailabilityModalComponent } from '../booking-availability-modal.component/booking-availability-modal.component';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BookingAvailabilityModalComponent],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.css'
})
export class BookingListComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Lista original del backend y lista filtrada para la vista
  bookings: BookingDTOResponse[] = [];
  filteredBookings: BookingDTOResponse[] = [];

  // Estados de carga y error
  isLoading: boolean = false;
  errorMessage: string = '';

  // Filtros de búsqueda local
  filterRoomNumber: string = '';
  filterGuest: string = ''; 
  filterEmployeeName: string = '';
  filterCheckInDate: string = '';
  filterCheckOutDate: string = '';
  filterActive: boolean | string = 'ALL'; // 'ALL', true, false

  // Control para abrir el modal de disponibilidad / alta
  showAvailabilityModal: boolean = false;

  // Propiedades para el control del modal de cancelación
  showCancelModal: boolean = false;
  bookingToCancelId: number | null = null;
  cancelReason: string = '';
  isCancelling: boolean = false;

  ngOnInit(): void {
    this.loadBookings();
  }

  /**
   * Carga inicial de reservas desde el backend
   */
  loadBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const activeParam = this.filterActive === 'ALL' ? undefined : (this.filterActive as boolean);

    this.bookingService.getBookings(activeParam).subscribe({
      next: (data) => {
        this.bookings = Array.isArray(data) ? data.map(b => ({
          ...b,
          roomNumber: b.room?.roomNumber || (b.room as any)?.number || 'N/A',
          employeeName: b.employeeName || 
                        (b.employee?.user ? `${b.employee.user.name || ''} ${b.employee.user.surname || ''}`.trim() : 'Sin Asignar')
        })) : [];

        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.errorMessage = 'No se pudieron cargar las reservas. Intente nuevamente.';
        this.isLoading = false;
        this.filteredBookings = [];
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Aplica los filtros locales (Habitación, Pasajero, Empleado, Fechas)
   */
  applyFilters(): void {
    if (!this.bookings) {
      this.filteredBookings = [];
      return;
    }

    this.filteredBookings = this.bookings.filter(b => {
      const roomNum = (b.roomNumber || b.room?.roomNumber || (b.room as any)?.number || '').toString();
      const matchesRoom = !this.filterRoomNumber || 
        roomNum.toLowerCase().includes(this.filterRoomNumber.toLowerCase().trim());

      const guestFirst = b.guestFirstName || '';
      const guestLast = b.guestLastName || '';
      const guestPhone = b.guestPhone || '';
      const fullGuestInfo = `${guestFirst} ${guestLast} ${guestPhone}`.toLowerCase();
      
      const matchesGuest = !this.filterGuest || 
        fullGuestInfo.includes(this.filterGuest.toLowerCase().trim());

      const empFirstName = b.employee?.user?.name || '';
      const empLastName = b.employee?.user?.surname || '';
      const fullEmpName = `${empFirstName} ${empLastName}`.trim();
      
      const matchesEmployee = !this.filterEmployeeName || 
        fullEmpName.toLowerCase().includes(this.filterEmployeeName.toLowerCase().trim());

      const bookingCheckIn = b.checkIn || '';
      const bookingCheckOut = b.checkOut || '';

      const matchesCheckIn = !this.filterCheckInDate || bookingCheckIn >= this.filterCheckInDate;
      const matchesCheckOut = !this.filterCheckOutDate || bookingCheckOut <= this.filterCheckOutDate;

      return matchesRoom && matchesGuest && matchesEmployee && matchesCheckIn && matchesCheckOut;
    });
  }

  /**
   * Limpia todos los filtros y reinicia la lista
   */
  resetFilters(): void {
    this.filterRoomNumber = '';
    this.filterGuest = '';
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
   * Abre el modal para indicar el motivo de cancelación
   */
  openCancelModal(bookingId: number): void {
    this.bookingToCancelId = bookingId;
    this.cancelReason = '';
    this.showCancelModal = true;
  }

  /**
   * Ejecuta el endpoint de cancelación en la API
   */
  submitCancellation(): void {
    if (!this.bookingToCancelId) return;

    this.isCancelling = true;
    const request = {
      bookingId: this.bookingToCancelId,
      reason: this.cancelReason.trim() || undefined
    };

    this.bookingService.cancelBooking(request).subscribe({
      next: () => {
        this.isCancelling = false;
        this.showCancelModal = false;
        this.loadBookings();
      },
      error: (err) => {
        console.error('Error al cancelar la reserva:', err);
        alert('No se pudo cancelar la reserva: ' + (err.error?.message || 'Error desconocido'));
        this.isCancelling = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Devuelve clases de estilo según el estado de la reserva
   */
  getStatusBadgeClass(status: BookingStatus | string | undefined): string {
    switch (status) {
      case BookingStatus.CONFIRMED:
      case 'CONFIRMED':
        return 'badge-success';
      case BookingStatus.PENDING:
      case 'PENDING':
        return 'badge-warning';
      case BookingStatus.CANCELLED:
      case 'CANCELLED':
        return 'badge-danger';
      case BookingStatus.NO_SHOW:
      case 'NO_SHOW':
        return 'badge-secondary';
      default:
        return 'badge-info';
    }
  }

  openAvailabilityModal(): void {
    this.showAvailabilityModal = true;
  }
}