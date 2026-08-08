import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account-service';
import { AccountDTOResponse } from '../../models/account.model';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-detail-component.html'
})
export class AccountDetailComponent implements OnInit {
  checkInId!: number;
  account?: AccountDTOResponse;
  loading = true;
  errorMessage = '';

  // Formulario de pago
  paymentAmount: number = 0;
  paymentMethod: string = 'CASH';
  transactionReference: string = '';

  // Ajustes por porcentaje
  discountPercent: number = 0;
  surchargePercent: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('checkInId');
    if (idParam) {
      this.checkInId = +idParam;
      this.loadAccount();
    }
  }

  loadAccount(): void {
    this.loading = true;
    this.errorMessage = '';

    this.accountService.getAccountByCheckInId(this.checkInId).subscribe({
      next: (data) => {
        this.account = data;
        this.paymentAmount = this.calculateRemaining();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = 'No se pudo cargar el resumen de la cuenta.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error(err);
      }
    });
  }

  calculateAdjustedTotal(): number {
    if (!this.account) return 0;
    const base = this.account.totalAmount;
    const surcharge = base * (this.surchargePercent / 100);
    const discount = base * (this.discountPercent / 100);
    return Math.max(0, base + surcharge - discount);
  }

  calculateRemaining(): number {
    if (!this.account) return 0;
    const totalWithAdjustments = this.calculateAdjustedTotal();
    const totalPaid = this.account.payments ? this.account.payments.reduce((acc, p) => acc + p.amount, 0) : 0;
    return Math.max(0, totalWithAdjustments - totalPaid);
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
        this.loadAccount();
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