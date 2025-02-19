import { Component, OnInit } from '@angular/core';
import { iReservation } from '../../interfaces/i-reservation';
import { ReservationService } from '../../services/reservation.service';
import { iFlavour } from '../../interfaces/i-flavour';
import { GelatoService } from '../../services/gelato.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  reservations: iReservation[] = [];
  flavours: iFlavour[] = [];
  errorMessage: string = '';

  constructor(
    private reservationSvc: ReservationService,
    private gelatoSvc: GelatoService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.loadFlavours();
  }

  //PRENOTAZIONI
  loadReservations(): void {
    this.reservationSvc.getReservations().subscribe({
      next: (data) => {
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
          this.reservations = this.reservations.filter((res) => res.id !== id);
        },
        error: (error) => {
          console.error("Errore nell'eliminazione della prenotazione:", error);
        },
      });
    }
  }

  //GUSTI
  loadFlavours(): void {
    this.gelatoSvc.getFlavours().subscribe({
      next: (data) => {
        this.flavours = data;
      },
      error: (error) => {
        this.errorMessage = 'Errore nel recupero dei gusti.';
        console.error(error);
      },
    });
  }

  deleteFlavour(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questo gusto?')) {
      this.gelatoSvc.deleteFlavour(id).subscribe({
        next: () => {
          this.flavours = this.flavours.filter((res) => res.id !== id);
        },
        error: (error) => {
          console.error("Errore nell'eliminazione del gusto:", error);
        },
      });
    }
  }
}
