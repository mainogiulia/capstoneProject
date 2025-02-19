import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { iReservation } from '../interfaces/i-reservation';
import { iCancelReservation } from '../interfaces/i-cancel-reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private reservationUrl = 'http://localhost:8080/api/reservation'; // URL DEL BACKEND

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessData')
      ? JSON.parse(localStorage.getItem('accessData')!).token
      : null;
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  //RECUPERO TUTTE LE PRENOTAZIONI (ADMIN)
  getReservations(): Observable<iReservation[]> {
    return this.http.get<iReservation[]>(this.reservationUrl, {
      headers: this.getHeaders(),
    });
  }

  //ELIMINAZIONE PRENOTAZIONE (ADMIN)
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.reservationUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  //CREO UNA NUOVA PRENOTAZIONE
  createReservation(reservation: iReservation): Observable<iReservation> {
    return this.http.post<iReservation>(this.reservationUrl, reservation);
  }

  //DISDETTA PRENOTAZIONE DA PARTE DEL CLIENTE TRAMITE CODICE
  cancelReservation(request: iCancelReservation): Observable<iReservation> {
    return this.http.delete<iReservation>(`${this.reservationUrl}/cancel`, {
      body: request,
    });
  }
}
