import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';
import { RoomResponse } from '../../models/room.model';
import { RoomState } from '../../models/room-state.enum';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  rooms: RoomResponse[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  isAdmin: boolean = false;

  RoomState = RoomState;

  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadRooms();
  }

  loadRooms(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.roomService.getAll().subscribe({
      next: (data) => {
        this.rooms = data.sort((a, b) => a.number - b.number);
        this.isLoading = false;
        
        // setTimeout evita el error NG0100 de Angular al forzar la detección
        setTimeout(() => this.cdr.detectChanges(), 0);
      },
      error: (err) => {
        console.error('Error al cargar habitaciones:', err);
        this.errorMessage = 'Ocurrió un error al cargar la lista de habitaciones.';
        this.isLoading = false;
        
        setTimeout(() => this.cdr.detectChanges(), 0);
      }
    });
  }

  // Método unificado para alternar (toggle) mantenimiento
  toggleMaintenance(room: RoomResponse): void {
    const isMaintenance = room.state === RoomState.MAINTENANCE;
    const confirmMsg = isMaintenance 
      ? `¿Deseas reactivar la habitación N° ${room.number}?`
      : `¿Estás seguro de poner la habitación N° ${room.number} en mantenimiento?`;

    if (confirm(confirmMsg)) {
      this.roomService.setMaintenance(room.id).subscribe({
        next: () => {
          const msg = isMaintenance 
            ? `La habitación N° ${room.number} fue reactivada exitosamente.`
            : `La habitación N° ${room.number} fue puesta en mantenimiento.`;
          
          this.showMessage(msg);
          this.loadRooms();
        },
        error: (err) => {
          alert(err.error?.message || 'No se pudo cambiar el estado de mantenimiento.');
        }
      });
    }
  }

  deleteRoom(room: RoomResponse): void {
    if (room.state === RoomState.OCCUPIED) {
      alert('No se puede eliminar una habitación en estado OCUPADA.');
      return;
    }

    if (confirm(`¿Estás seguro de eliminar la habitación N° ${room.number}?`)) {
      this.roomService.delete(room.id).subscribe({
        next: () => {
          this.showMessage(`Habitación N° ${room.number} eliminada con éxito.`);
          this.loadRooms();
        },
        error: (err) => {
          alert(err.error?.message || 'Error al intentar eliminar la habitación.');
        }
      });
    }
  }

  private showMessage(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => this.cdr.detectChanges(), 0);
    
    setTimeout(() => {
      this.successMessage = '';
      setTimeout(() => this.cdr.detectChanges(), 0);
    }, 4000);
  }
}