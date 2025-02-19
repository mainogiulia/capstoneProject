import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PayPalService {
  paypalUrl = environment.paypalUrl; // URL DEL BACKEND

  constructor(private http: HttpClient) {}

  //CREO L'ORDINE DI PAYPAL
  createOrder(totalScoops: number): Observable<{ approvalUrl: string }> {
    return this.http
      .post<{ approvalUrl: string }>(
        `${this.paypalUrl}/paypal/createOrder?totalScoops=${totalScoops}`,
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
