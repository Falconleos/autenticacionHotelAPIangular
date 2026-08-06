import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AccountDtoResponse } from '../models/account.model';
import { CheckInDtoResponse } from '../models/check-in.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:8080/private/accounts';
  private checkInUrl = 'http://localhost:8080/private/check-ins';

  constructor(private http: HttpClient) {}

  getAllAccounts(): Observable<AccountDtoResponse[]> {
    return this.http.get<CheckInDtoResponse[]>(this.checkInUrl, { withCredentials: true }).pipe(
      switchMap(checkIns => {
        if (!checkIns || checkIns.length === 0) {
          return of([]);
        }
        
        const accountRequests = checkIns.map(checkIn => 
          this.http.get<AccountDtoResponse>(`${this.apiUrl}/check-in/${checkIn.id}`, { withCredentials: true }).pipe(
            map(account => ({
              ...account,
              user: checkIn.user,
              roomNumber: checkIn.booking?.room?.number,
              checkInDate: checkIn.booking?.checkIn,
              checkOutDate: checkIn.booking?.checkOut
            } as AccountDtoResponse)),
            catchError(() => of(null))
          )
        );

        return forkJoin(accountRequests).pipe(
          map(results => results.filter((acc): acc is AccountDtoResponse => acc !== null))
        );
      })
    );
  }
}