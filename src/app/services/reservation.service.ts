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

  //RECUPERO TUTTE LE PRENOTAZIONI
  getReservations(): Observable<iReservation[]> {
    const storedData = localStorage.getItem('accessData');

    if (!storedData) {
      console.error('Nessun token trovato!');
      return throwError(() => new Error('Nessun token trovato'));
    }

    const parsedData = JSON.parse(storedData);
    const token = parsedData.token;

    if (!token) {
      console.error('Token JWT mancante!');
      return throwError(() => new Error('Token JWT mancante'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<iReservation[]>(this.reservationUrl, { headers });
  }

  //ELIMINAZIONE PRENOTAZIONE DA PARTE DELL'ADMIN
  deleteReservation(id: number): Observable<void> {
    const storedData = localStorage.getItem('accessData');

    if (!storedData) {
      console.error('Nessun token trovato!');
      return throwError(() => new Error('Nessun token trovato'));
    }

    const parsedData = JSON.parse(storedData); // Decodifica il JSON
    const token = parsedData.token; // Estrai SOLO il token

    if (!token) {
      console.error('Token JWT mancante!');
      return throwError(() => new Error('Token JWT mancante'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.reservationUrl}/${id}`, { headers });
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
