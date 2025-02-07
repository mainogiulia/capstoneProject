import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { iReservation } from '../../interfaces/i-reservation';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {
  newReservation: iReservation = {
    customerName: '',
    email: '',
    reservationDate: '',
    numberOfGuests: 0,
  };

  successMessage: string = '';

  constructor(private reservationSvc: ReservationService) {}

  createReservation(): void {
    this.reservationSvc
      .createReservation(this.newReservation)
      .subscribe((data) => {
        this.successMessage = 'Prenotazione creata con successo!';
        this.clearForm();
      });
  }

  clearForm(): void {
    this.newReservation = {
      customerName: '',
      email: '',
      reservationDate: '',
      numberOfGuests: 0,
    };
  }
}
