import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { RoomTypeService } from '../../services/room-type.service';
import { RoomTypeResponse } from '../../models/room-type.model';
import { RoomRequest, RoomUpdateRequest } from '../../models/room.model';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.css']
})
export class RoomFormComponent implements OnInit {

  roomForm!: FormGroup;
  roomTypes: RoomTypeResponse[] = [];
  
  isEditMode: boolean = false;
  roomId: number | null = null;
  
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private roomTypeService: RoomTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoomTypes();

    // Verificamos si recibimos un ID en los parámetros de la URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.roomId = Number(idParam);
      this.loadRoomData(this.roomId);
    }
  }

  private initForm(): void {
    this.roomForm = this.fb.group({
      number: ['', [Validators.required, Validators.min(1)]],
      roomTypeId: ['', [Validators.required]]
    });
  }

  private loadRoomTypes(): void {
    this.roomTypeService.getAll().subscribe({
      next: (types) => {
        this.roomTypes = types;
      },
      error: (err) => {
        console.error('Error al cargar tipos de habitación:', err);
        this.errorMessage = 'No se pudieron cargar los tipos de habitación disponibles.';
      }
    });
  }

  private loadRoomData(id: number): void {
    this.isLoading = true;
    this.roomService.getById(id).subscribe({
      next: (room) => {
        this.roomForm.patchValue({
          number: room.number,
          roomTypeId: room.roomTypeId
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar la habitación:', err);
        this.errorMessage = 'No se encontró la habitación solicitada.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.roomForm.invalid) {
      this.roomForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValues = this.roomForm.value;

    if (this.isEditMode && this.roomId) {
      // Modo Edición
      const updateDto: RoomUpdateRequest = {
        number: Number(formValues.number),
        roomTypeId: Number(formValues.roomTypeId)
      };

      this.roomService.update(this.roomId, updateDto).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/habitaciones']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Error al actualizar la habitación.';
        }
      });
    } else {
      // Modo Creación
      const createDto: RoomRequest = {
        number: Number(formValues.number),
        roomTypeId: Number(formValues.roomTypeId)
      };

      this.roomService.create(createDto).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/habitaciones']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Error al guardar la habitación. Verifique que el número no esté duplicado.';
        }
      });
    }
  }
}