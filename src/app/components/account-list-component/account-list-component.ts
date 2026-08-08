import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account-service';
import { AccountDTOResponse } from '../../models/account.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule], // Quitamos RouterLink si no se usa
  templateUrl: './account-list-component.html',
  styleUrls: ['./account-list-component.css']
})
export class AccountListComponent implements OnInit {
  accounts: AccountDTOResponse[] = [];
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
      next: (data: AccountDTOResponse[]) => {
        this.accounts = Array.isArray(data) ? [...data] : [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.errorMessage = 'No se pudieron cargar las cuentas o no cuentas con los permisos necesarios.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error(err);
      }
    });
  }

  openAddPaymentModal(accountId: number): void {
    alert('Funcionalidad de agregar pago próximamente.');
  }

  openAddSurchargeModal(accountId: number): void {
    alert('Funcionalidad de agregar recargo próximamente.');
  }
}