import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PayPalService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  //CREO L'ORDINE DI PAYPAL
  createOrder(totalScoops: number): Observable<{ approvalUrl: string }> {
    return this.http
      .post<{ approvalUrl: string }>(
        `${this.apiUrl}/paypal/createOrder?totalScoops=${totalScoops}`,
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
  captureOrder(
    token: string
  ): Observable<{ status: string; transactionId?: string; message: string }> {
    return this.http.post<{
      status: string;
      transactionId?: string;
      message: string;
    }>(
      'http://localhost:8080/paypal/captureOrder',
      null, // Nessun body richiesto
      { params: new HttpParams().set('token', token) }
    );
  }
}
