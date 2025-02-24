import { Component } from '@angular/core';
import { iReservation } from '../../interfaces/i-reservation';
import { ReservationService } from '../../services/reservation.service';
import L from 'leaflet';
import { iCancelReservation } from '../../interfaces/i-cancel-reservation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  //NUOVA PRENOTAZIONE
  newReservation: iReservation = {
    customerName: '',
    email: '',
    reservationDate: '',
    reservationTime: '',
    numberOfGuests: 0,
  };

  //CANCELLAZIONE PRENOTAZIONE
  cancelRequest: iCancelReservation = {
    customerName: '',
    cancellationCode: '',
  };

  successMessage: string = '';
  cancelMessage: string = '';
  isCancelSuccess: boolean = false;
  isSuccessFading: boolean = false;
  isCancelFading: boolean = false;
  availableTimes: string[] = [];

  constructor(private reservationSvc: ReservationService) {}

  ngOnInit() {
    this.generateAvailableTimes();
  }

  generateAvailableTimes() {
    const times: string[] = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (let h = 18; h < 23; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (
          this.newReservation.reservationDate === this.minDate &&
          (h < currentHour || (h === currentHour && m <= currentMinute))
        ) {
          continue;
        }
        const hour = String(h).padStart(2, '0');
        const minute = String(m).padStart(2, '0');
        times.push(`${hour}:${minute}`);
      }
    }
    this.availableTimes = times;
  }

  createReservation(): void {
    const today = new Date();
    const selectedDate = new Date(this.newReservation.reservationDate);
    const selectedTime = this.newReservation.reservationTime;

    const [hours, minutes] = selectedTime.split(':').map(Number);
    selectedDate.setHours(hours, minutes, 0, 0);

    if (selectedDate < today) {
      this.cancelMessage =
        'Errore: la prenotazione deve essere per una data e ora future.';
      return;
    }

    this.reservationSvc.createReservation(this.newReservation).subscribe({
      next: (data) => {
        this.successMessage = 'Prenotazione creata con successo!';
        this.autoCloseSuccessMessage();
        this.clearForm();
      },
      error: (error) => {
        this.cancelMessage = 'Errore nella creazione della prenotazione.';
        this.isCancelSuccess = false;
        this.autoCloseCancelMessage();
      },
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

  //CANCELLAZIONE PRENOTAZIONE
  cancelReservation(): void {
    this.reservationSvc.cancelReservation(this.cancelRequest).subscribe({
      next: () => {
        this.cancelMessage = 'Prenotazione cancellata con successo!';
        this.isCancelSuccess = true;
        this.autoCloseCancelMessage();
        this.clearCancelForm();
      },
      error: () => {
        this.cancelMessage =
          'Errore: prenotazione non trovata o codice errato.';
        this.isCancelSuccess = false;
        this.autoCloseCancelMessage();
      },
    });
  }

  clearCancelForm(): void {
    this.cancelRequest = {
      customerName: '',
      cancellationCode: '',
    };
  }

  //POPUP CANCELLAZIONE
  isPopupVisible = false;

  togglePopup(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

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

  clearSuccessMessage(): void {
    this.animateAndClearSuccess();
  }

  clearCancelMessage(): void {
    this.animateAndClearCancel();
  }

  autoCloseSuccessMessage(): void {
    setTimeout(() => {
      this.animateAndClearSuccess();
    }, 5000);
  }

  autoCloseCancelMessage(): void {
    setTimeout(() => {
      this.animateAndClearCancel();
    }, 5000);
  }

  animateAndClearSuccess(): void {
    this.isSuccessFading = true;
    setTimeout(() => {
      this.successMessage = '';
      this.isSuccessFading = false;
    }, 300);
  }

  animateAndClearCancel(): void {
    this.isCancelFading = true;
    setTimeout(() => {
      this.cancelMessage = '';
      this.isCancelFading = false;
    }, 300);
  }
}
