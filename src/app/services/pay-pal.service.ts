import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PayPalService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  //CREO L'ORDINE DI PAYPAL
  createOrder(): Observable<{ approvalUrl: string }> {
    return this.http
      .post<{ approvalUrl: string }>(
        `${this.apiUrl}/paypal/createOrder`,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(catchError(this.handleError));
  }

  //GESTISCO GLI ERRORI
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Errore client:', error.error.message);
    } else {
      console.error(
        `Backend restituisce codice ${error.status}, ` +
          `body era: ${error.error}`
      );
    }

    return throwError(
      () =>
        new Error('Si è verificato un errore. Per favore riprova più tardi.')
    );
  }

  //CATTURO L'ORDINE DI PAYPAL
  captureOrder(token: string): Observable<string> {
    return this.http
      .post<string>(`${this.apiUrl}/paypal/captureOrder`, { token })
      .pipe(
        catchError((error) => {
          console.error("Errore durante la cattura dell'ordine PayPal:", error);
          return throwError(() => new Error('Errore cattura PayPal'));
        })
      );
  }
}
