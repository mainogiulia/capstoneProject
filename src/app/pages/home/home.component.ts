import { Component } from '@angular/core';
import { iReservation } from '../../interfaces/i-reservation';
import { ReservationService } from '../../services/reservation.service';
import L from 'leaflet';

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

  //PER LA MAPPA
  private map!: L.Map;

  private initMap(): void {
    this.map = L.map('map').setView([45.67, 11.515], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    const iconDefault = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    L.Marker.prototype.options.icon = iconDefault;

    L.marker([45.67, 11.515], { icon: iconDefault })
      .addTo(this.map)
      .bindPopup('📍 Via Astichello, 58, Montecchio Precalcino')
      .openPopup();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
