import { Component, EventEmitter, Output, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { RoomDTOResponse, BookingDTORequest } from '../../models/booking.model';
import { RoomTypeResponse } from '../../models/room-type.model';

@Component({
  selector: 'app-booking-availability-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-availability-modal.component.html',
  styleUrl: './booking-availability-modal.component.css'
})
export class BookingAvailabilityModalComponent {
  private readonly bookingService = inject(BookingService);
  private readonly cdr = inject(ChangeDetectorRef);

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

  // Estados de carga, banderas y mensajes
  hasSearched: boolean = false;
  isSearching: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';

  // Formulario final para crear la reserva (Paso 2) - Alineado con BookingDTORequest de Java
  bookingRequest: BookingDTORequest = {
    roomId: 0,
    employeeId: 1, // <--- Añadido valor por defecto o ID del empleado actual
    checkIn: '',
    checkOut: '',
    guestCount: 1,
    guestFirstName: '',
    guestLastName: '',
    guestPhone: '',
    observation: ''
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
    this.hasSearched = false;

    console.log('Enviando búsqueda con:', { 
      checkIn: this.searchCheckIn, 
      checkOut: this.searchCheckOut, 
      guestCount: this.searchGuestCount 
    });

    this.bookingService.getAvailableRooms(this.searchCheckIn, this.searchCheckOut, this.searchGuestCount).subscribe({
      next: (rooms) => {
        console.log('Habitaciones recibidas con éxito:', rooms);
        
        // Mapeo robusto adaptado a Spring Boot
        this.availableRooms = Array.isArray(rooms) ? rooms.map((r: any) => {
          // Extraemos el nombre del tipo de habitación de forma segura sin importar cómo lo envíe Java
          let resolvedTypeName = 'General';
          if (typeof r.roomType === 'string') {
            resolvedTypeName = r.roomType;
          } else if (r.roomType && typeof r.roomType === 'object') {
            resolvedTypeName = r.roomType.name || r.roomType.typeName || 'General';
          } else if (r.roomTypeName) {
            resolvedTypeName = r.roomTypeName;
          } else if (r.typeName) {
            resolvedTypeName = r.typeName;
          }

          return {
            ...r,
            roomNumber: r.roomNumber !== undefined && r.roomNumber !== null ? r.roomNumber : (r.number !== undefined && r.number !== null ? r.number : (r.id ?? 'N/A')),
            roomType: resolvedTypeName,
            capacity: r.capacity ?? r.roomType?.capacity ?? r.maxGuests ?? 1,
            pricePerNight: r.pricePerNight ?? r.roomType?.pricePerNight ?? r.price ?? 0
          };
        }) : [];

        this.isSearching = false;
        this.hasSearched = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error detallado al buscar disponibilidad:', err);
        this.errorMessage = 'Ocurrió un error al consultar las habitaciones disponibles. Código: ' + (err.status || 'Desconocido');
        this.isSearching = false;
        this.hasSearched = true;
        this.availableRooms = [];
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Seleccionar habitación y pasar al Paso 2
   */
  selectRoom(room: RoomDTOResponse): void {
    console.log('Habitación seleccionada:', room);
    this.selectedRoom = room;
    
    // Asignación correcta de IDs y fechas mapeadas a los nombres del DTO de Java
    this.bookingRequest.roomId = room.id || (room as any).roomId || 0;
    this.bookingRequest.checkIn = this.searchCheckIn;
    this.bookingRequest.checkOut = this.searchCheckOut;
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

    console.log('JSON enviado al servidor:', JSON.stringify(this.bookingRequest, null, 2));

    this.bookingService.createBooking(this.bookingRequest).subscribe({
      next: () => {
        this.isSaving = false;
        this.bookingCreated.emit();
        this.close();
      },
      error: (err) => {
        console.error('Error al crear reserva:', err);
        const serverMessage = err.error?.message || err.message || 'Verifique los datos ingresados.';
        this.errorMessage = 'No se pudo registrar la reserva: ' + serverMessage;
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  /**
   * Calcula la cantidad de noches entre el Check-In y Check-Out
   */
  calculateNights(): number {
    if (!this.searchCheckIn || !this.searchCheckOut) return 0;
    const start = new Date(this.searchCheckIn);
    const end = new Date(this.searchCheckOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }
}