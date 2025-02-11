import { Component } from '@angular/core';
import { iReservation } from '../../interfaces/i-reservation';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  newReservation: iReservation = {
    customerName: '',
    email: '',
    reservationDate: '',
    reservationTime: '',
    numberOfGuests: 0,
  };

  successMessage: string = '';
  availableTimes: string[] = [];

  constructor(private reservationSvc: ReservationService) {}

  ngOnInit() {
    this.generateAvailableTimes();
  }

  generateAvailableTimes() {
    const times: string[] = [];
    for (let h = 18; h < 23; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour = String(h).padStart(2, '0');
        const minute = String(m).padStart(2, '0');
        times.push(`${hour}:${minute}`);
      }
    }
    this.availableTimes = times;
  }

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
      reservationTime: '',
      numberOfGuests: 0,
    };
  }

  minDate = new Date().toISOString().split('T')[0]; // PRENDE SOLO "YYYY-MM-DD"
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 6))
    .toISOString()
    .split('T')[0]; // PRENDE SOLO "YYYY-MM-DD"
}
