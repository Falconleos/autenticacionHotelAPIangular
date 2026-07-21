import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { RoomDTOResponse, BookingDTORequest, CustomerType } from '../../models/booking.model';

@Component({
  selector: 'app-booking-availability-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-availability-modal.component.html',
  styleUrl: './booking-availability-modal.component.css'
})
export class BookingAvailabilityModalComponent {
  private readonly bookingService = inject(BookingService);

  @Output() closeModal = new EventEmitter<void>();
  @Output() bookingCreated = new EventEmitter<void>();

  // Control de paso del wizard (1: Búsqueda/Habitaciones, 2: Datos Huésped)
  currentStep: number = 1;

  // Criterios de disponibilidad (Paso 1)
  searchCheckIn: string = '';
  searchCheckOut: string = '';
  searchGuestCount: number = 1;

  // Lista de habitaciones devueltas
  availableRooms: RoomDTOResponse[] = [];
  selectedRoom: RoomDTOResponse | null = null;

  // Estados de carga y mensajes
  isSearching: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';

  // Formulario final para crear la reserva (Paso 2)
  bookingRequest: BookingDTORequest = {
    roomId: 0,
    guestName: '',
    guestLastName: '',
    guestEmail: '',
    guestPhone: '',
    guestPassport: '',
    customerType: CustomerType.INDIVIDUAL,
    checkInDate: '',
    checkOutDate: '',
    guestCount: 1
  };

  /**
   * Buscar habitaciones disponibles según fechas y huéspedes
   */
  onSearchAvailability(): void {
    if (!this.searchCheckIn || !this.searchCheckOut) {
      this.errorMessage = 'Debe seleccionar fechas de Check-In y Check-Out válidas.';
      return;
    }

    if (this.searchCheckOut <= this.searchCheckIn) {
      this.errorMessage = 'La fecha de Check-Out debe ser posterior a la de Check-In.';
      return;
    }

    this.errorMessage = '';
    this.isSearching = true;
    console.log('Enviando búsqueda con:', { 
      checkIn: this.searchCheckIn, 
      checkOut: this.searchCheckOut, 
      guestCount: this.searchGuestCount 
    });

    this.bookingService.getAvailableRooms(this.searchCheckIn, this.searchCheckOut, this.searchGuestCount).subscribe({
      next: (rooms) => {
        console.log('Habitaciones recibidas con éxito:', rooms);
        this.availableRooms = rooms;
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Error detallado al buscar disponibilidad:', err);
        this.errorMessage = 'Ocurrió un error al consultar las habitaciones disponibles. Código: ' + (err.status || 'Desconocido');
        this.isSearching = false;
      }
    });
  }

  /**
   * Seleccionar habitación y pasar al Paso 2
   */
  selectRoom(room: RoomDTOResponse): void {
    this.selectedRoom = room;
    // Fallback con '|| 0' para evitar error 'number | undefined'
    this.bookingRequest.roomId = room.id || 0;
    this.bookingRequest.checkInDate = this.searchCheckIn;
    this.bookingRequest.checkOutDate = this.searchCheckOut;
    this.bookingRequest.guestCount = this.searchGuestCount;
    this.currentStep = 2;
    this.errorMessage = '';
  }

  /**
   * Volver al Paso 1
   */
  goBackToStep1(): void {
    this.currentStep = 1;
    this.errorMessage = '';
  }

  /**
   * Confirmar y crear la reserva en Spring Boot
   */
  onSubmitBooking(): void {
    this.isSaving = true;
    this.errorMessage = '';

    this.bookingService.createBooking(this.bookingRequest).subscribe({
      next: () => {
        this.isSaving = false;
        this.bookingCreated.emit();
        this.close();
      },
      error: (err) => {
        console.error('Error al crear reserva:', err);
        this.errorMessage = 'No se pudo registrar la reserva. Verifique los datos ingresados.';
        this.isSaving = false;
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }
}