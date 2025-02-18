import { Component, OnInit } from '@angular/core';
import { iReservation } from '../../interfaces/i-reservation';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  reservations: iReservation[] = [];
  errorMessage: string = '';

  constructor(private reservationSvc: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationSvc.getReservations().subscribe({
      next: (data) => {
        console.log(data);
        this.reservations = data;
      },
      error: (error) => {
        this.errorMessage = 'Errore nel recupero delle prenotazioni.';
        console.error(error);
      },
    });
  }

  deleteReservation(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa prenotazione?')) {
      this.reservationSvc.deleteReservation(id).subscribe({
        next: () => {
          console.log(`Prenotazione con ID ${id} eliminata con successo`);
          this.reservations = this.reservations.filter((res) => res.id !== id);
        },
        error: (error) => {
          console.error("Errore nell'eliminazione della prenotazione:", error);
        },
      });
    }
  }
}
