import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { iReservation } from '../interfaces/i-reservation';
import { iCancelReservation } from '../interfaces/i-cancel-reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private reservationUrl = 'http://localhost:8080/api/reservation'; // URL del backend

  constructor(private http: HttpClient) {}

  //RECUPERO TUTTE LE PRENOTAZIONI
  getReservations(): Observable<iReservation[]> {
    return this.http.get<iReservation[]>(this.reservationUrl);
  }

  //CREO UNA NUOVA PRENOTAZIONE
  createReservation(reservation: iReservation): Observable<iReservation> {
    return this.http.post<iReservation>(this.reservationUrl, reservation);
  }

  //ELIMINAZIONE PRENOTAZIONE DA PARTE DELL'ADMIN
  deleteReservation(id: number): Observable<iReservation> {
    return this.http.delete<iReservation>(`${this.reservationUrl}/${id}`);
  }

  //DISDETTA PRENOTAZIONE DA PARTE DEL CLIENTE TRAMITE CODICE
  cancelReservation(request: iCancelReservation): Observable<iReservation> {
    return this.http.delete<iReservation>(`${this.reservationUrl}/cancel`, {
      body: request,
    });
  }
}
