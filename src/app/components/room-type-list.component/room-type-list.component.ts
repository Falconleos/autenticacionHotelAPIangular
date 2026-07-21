import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- 1. Importar ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RoomTypeService } from '../../services/room-type.service';
import { RoomTypeRequest, RoomTypeResponse } from '../../models/room-type.model';

@Component({
  selector: 'app-room-type-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './room-type-list.component.html',
  styleUrls: ['./room-type-list.component.css']
})
export class RoomTypeListComponent implements OnInit {

  roomTypes: RoomTypeResponse[] = [];
  typeForm!: FormGroup;

  isLoading: boolean = false;
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedTypeId: number | null = null;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private roomTypeService: RoomTypeService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef // <-- 2. Inyectar en el constructor
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoomTypes();
  }

  private initForm(): void {
    this.typeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      capacity: [1, [Validators.required, Validators.min(1)]],
      pricePerNight: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.maxLength(250)]]
    });
  }

  loadRoomTypes(): void {
    this.isLoading = true;
    this.roomTypeService.getAll().subscribe({
      next: (types) => {
        this.roomTypes = types;
        this.isLoading = false;
        this.cdr.detectChanges(); // <-- 3. Forzar refresco
      },
      error: (err) => {
        console.error('Error al obtener tipos de habitación:', err);
        this.errorMessage = 'No se pudieron cargar los tipos de habitación.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedTypeId = null;
    this.typeForm.reset({ capacity: 1, pricePerNight: 0 });
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openEditModal(type: RoomTypeResponse): void {
    this.isEditMode = true;
    this.selectedTypeId = type.id;
    this.typeForm.patchValue({
      name: type.name,
      capacity: type.capacity,
      pricePerNight: type.pricePerNight,
      description: type.description
    });
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.typeForm.reset();
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.typeForm.invalid) {
      this.typeForm.markAllAsTouched();
      return;
    }

    const formValue: RoomTypeRequest = {
      name: this.typeForm.value.name,
      capacity: Number(this.typeForm.value.capacity),
      pricePerNight: Number(this.typeForm.value.pricePerNight),
      description: this.typeForm.value.description
    };

    this.isLoading = true;

    if (this.isEditMode && this.selectedTypeId) {
      this.roomTypeService.update(this.selectedTypeId, formValue).subscribe({
        next: () => {
          this.showMessage('Categoría actualizada exitosamente.');
          this.closeModal();
          this.loadRoomTypes();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al actualizar la categoría.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.roomTypeService.create(formValue).subscribe({
        next: () => {
          this.showMessage('Nueva categoría creada exitosamente.');
          this.closeModal();
          this.loadRoomTypes();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al crear la categoría.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteType(type: RoomTypeResponse): void {
    if (type.name.toLowerCase() === 'basic') {
      alert('La categoría por defecto "Basic" no puede ser eliminada.');
      return;
    }

    if (confirm(`¿Estás seguro de eliminar el tipo "${type.name}"?`)) {
      this.roomTypeService.delete(type.id).subscribe({
        next: () => {
          this.showMessage(`Categoría "${type.name}" eliminada correctamente.`);
          this.loadRoomTypes();
        },
        error: (err) => {
          alert(err.error?.message || 'Ocurrió un error al intentar eliminar el tipo de habitación.');
        }
      });
    }
  }

  private showMessage(msg: string): void {
    this.successMessage = msg;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 4000);
  }
}