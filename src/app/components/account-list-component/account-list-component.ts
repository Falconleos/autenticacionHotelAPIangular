import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../services/account-service';
import { AccountDtoResponse } from '../../models/account.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-list-component.html',
  styleUrls: ['./account-list-component.css']
})
export class AccountListComponent implements OnInit {
  accounts: AccountDtoResponse[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = Array.isArray(data) ? [...data] : [];
        this.loading = false;
        this.cdr.markForCheck(); // Fuerza la actualización de la vista
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar las cuentas o no cuentas con los permisos necesarios.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error(err);
      }
    });
  }

  // Métodos sin funcionalidad por el momento tal como solicitaste
  openAddPaymentModal(accountId: number): void {
    alert('Funcionalidad de agregar pago próximamente.');
  }

  openAddSurchargeModal(accountId: number): void {
    alert('Funcionalidad de agregar recargo próximamente.');
  }
}