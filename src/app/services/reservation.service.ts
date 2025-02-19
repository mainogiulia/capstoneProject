import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { iReservation } from '../interfaces/i-reservation';
import { iCancelReservation } from '../interfaces/i-cancel-reservation';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  reservationUrl: string = environment.reservationUrl; // URL DEL BACKEND

  constructor(private http: HttpClient) {
    this.loadReservationsFromLocalStorage(); // CARICA LE PRENOTAZIONI DAL LOCAL STORAGE AL MOMENTO DELL'INIZIALIZZAZIONE
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessData')
      ? JSON.parse(localStorage.getItem('accessData')!).token
      : null;
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // SALVA LE PRENOTAZIONI DAL LOCAL STORAGE
  private updateLocalStorage(reservations: iReservation[]): void {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }

  // CARICA LE PRENOTAZIONI DAL LOCAL STORAGE
  private loadReservationsFromLocalStorage(): void {
    const savedReservations = localStorage.getItem('reservations');
    if (savedReservations) {
      const reservations: iReservation[] = JSON.parse(savedReservations);
      this.updateLocalStorage(reservations); // IMPOSTA LE PRENOTAZIONI NEL LOCAL STORAGE
    }
  }

  // RECUPERA LE PRENOTAZIONI DAL LOCAL STORAGE
  private getReservationsFromLocalStorage(): iReservation[] {
    const savedReservations = localStorage.getItem('reservations');
    return savedReservations ? JSON.parse(savedReservations) : [];
  }

  //RECUPERO TUTTE LE PRENOTAZIONI (ADMIN)
  getReservations(): Observable<iReservation[]> {
    return this.http
      .get<iReservation[]>(this.reservationUrl, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((reservations) => {
          this.updateLocalStorage(reservations); // AGGIORNA LE PRENOTAZIONI NEL LOCAL STORAGE
        })
      );
  }

  //ELIMINAZIONE PRENOTAZIONE (ADMIN)
  deleteReservation(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.reservationUrl}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => {
          // RIMUOVE LA PRENOTAZIONE DAL LOCAL STORAGE
          const updatedReservations =
            this.getReservationsFromLocalStorage().filter(
              (res) => res.id !== id
            );
          this.updateLocalStorage(updatedReservations);
        })
      );
  }

  //CREO UNA NUOVA PRENOTAZIONE
  createReservation(reservation: iReservation): Observable<iReservation> {
    return this.http.post<iReservation>(this.reservationUrl, reservation).pipe(
      tap((newReservation) => {
        const reservations = this.getReservationsFromLocalStorage();
        reservations.push(newReservation); // AGGIUNGE LA NUOVA PRENOTAZIONE
        this.updateLocalStorage(reservations); // SALVA LE PRENOTAZIONI AGGIORNATE NEL LOCAL STORAGE
      })
    );
  }

  //DISDETTA PRENOTAZIONE DA PARTE DEL CLIENTE TRAMITE CODICE
  cancelReservation(request: iCancelReservation): Observable<iReservation> {
    return this.http
      .delete<iReservation>(`${this.reservationUrl}/cancel`, {
        body: request,
      })
      .pipe(
        tap((canceledReservation) => {
          const updatedReservations =
            this.getReservationsFromLocalStorage().filter(
              (res) => res.id !== canceledReservation.id
            );
          this.updateLocalStorage(updatedReservations); // RIMUOVE LA PRENOTAZIONE ANNULLATA DAL LOCAL STORAGE
        })
      );
  }
}
