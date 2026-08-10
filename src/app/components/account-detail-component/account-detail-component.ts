import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account-service';
import { CheckInService } from '../../services/check-in-service';
import { AccountDTOResponse } from '../../models/account.model';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-detail-component.html',
  styleUrls: ['./account-detail-component.css']
})
export class AccountDetailComponent implements OnInit {
  checkInId!: number;
  account?: AccountDTOResponse;
  checkInState: string = '';
  loading = true;
  errorMessage = '';

  // Formulario de pago
  paymentAmount: number = 0;
  paymentMethod: string = 'CASH';
  transactionReference: string = '';

  // Ajustes por porcentaje
  discountPercent: number = 0;
  surchargePercent: number = 0;

  // Total que se actualiza únicamente al hacer clic en "Aplicar"
  adjustedTotal: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private checkInService: CheckInService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('checkInId');
    if (idParam) {
      this.checkInId = +idParam;
      this.loadData();
    }
  }

  loadData(): void {
    this.loading = true;
    this.errorMessage = '';

    // Cargamos la cuenta y el check-in en paralelo o secuencia para obtener su estado
    this.accountService.getAccountByCheckInId(this.checkInId).subscribe({
      next: (accountData) => {
        this.account = accountData;
        
        // Inicializamos el total con la suma base de la estadía e ítems
        this.adjustedTotal = this.calculateRawTotal();
        this.paymentAmount = this.calculateRemaining();

        // Obtenemos el check-in para conocer su estado actual
        this.checkInService.getAll().subscribe({
          next: (checkIns) => {
            const currentCheckIn = checkIns.find(c => c.id === this.checkInId);
            if (currentCheckIn) {
              this.checkInState = currentCheckIn.checkInState;
            }
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: () => {
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'No se pudo cargar el resumen de la cuenta.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error(err);
      }
    });
  }

  // Calcula la suma bruta (Estadía base + ítems) sin porcentajes
  calculateRawTotal(): number {
    if (!this.account) return 0;
    const base = this.account.totalAmount;
    const itemsTotal = this.account.items ? this.account.items.reduce((acc, item) => acc + item.subtotal, 0) : 0;
    return base + itemsTotal;
  }

  // Se ejecuta al hacer clic en el botón "Aplicar"
  applyAdjustments(): void {
    const rawTotal = this.calculateRawTotal();
    const surcharge = rawTotal * (this.surchargePercent / 100);
    const discount = rawTotal * (this.discountPercent / 100);
    
    this.adjustedTotal = Math.max(0, rawTotal + surcharge - discount);
    this.paymentAmount = this.calculateRemaining();
  }

  // Retorna el total ajustado actual para el HTML
  calculateAdjustedTotal(): number {
    return this.adjustedTotal;
  }

  calculateRemaining(): number {
    if (!this.account) return 0;
    const totalPaid = this.account.payments ? this.account.payments.reduce((acc, p) => acc + p.amount, 0) : 0;
    return Math.max(0, this.adjustedTotal - totalPaid);
  }

  submitPayment(): void {
    if (!this.account || this.paymentAmount <= 0) return;

    const paymentPayload = {
      accountId: this.account.id,
      amount: this.paymentAmount,
      paymentMethod: this.paymentMethod,
      transactionReference: this.transactionReference || 'Pago en mostrador'
    };

    this.accountService.addPayment(paymentPayload).subscribe({
      next: () => {
        this.paymentAmount = 0;
        this.transactionReference = '';
        this.loadData();
      },
      error: (err) => {
        alert('Error al registrar el pago.');
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}