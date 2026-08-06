import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from './account-service';
import { PaymentDtoResponse } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private accountService: AccountService) {}

  // Obtiene todos los pagos de todas las cuentas, enriqueciéndolos con los datos del usuario
  getAllPayments(): Observable<PaymentDtoResponse[]> {
    return this.accountService.getAllAccounts().pipe(
      map(accounts => {
        let allPayments: PaymentDtoResponse[] = [];
        
        accounts.forEach(account => {
          if (account.payments && account.payments.length > 0) {
            account.payments.forEach(payment => {
              allPayments.push({
                ...payment,
                accountId: account.id,
                userName: account.user?.name,
                userSurname: account.user?.surname
              });
            });
          }
        });
        
        return allPayments;
      })
    );
  }
}