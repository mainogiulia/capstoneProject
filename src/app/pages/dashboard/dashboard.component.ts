import { Component, OnInit } from '@angular/core';
import { iReservation } from '../../interfaces/i-reservation';
import { ReservationService } from '../../services/reservation.service';
import { iFlavour } from '../../interfaces/i-flavour';
import { GelatoService } from '../../services/gelato.service';
import { iGelatoOrder } from '../../interfaces/i-gelato-order';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  reservations: iReservation[] = [];
  flavours: iFlavour[] = [];
  gelatoOrders: iGelatoOrder[] = [];
  errorMessage: string = '';
  showDetailsForOrders: { [key: number]: boolean } = {}; // OGGETTO PER I DETTAGLI DEGLI ORDINI
  selectedOrderId: number | null = null; // VARIABILE PER TENERE TRACCIA DELL'ORDINE SELEZIONATO

  constructor(
    private reservationSvc: ReservationService,
    private gelatoSvc: GelatoService,
    private orderSvc: OrderService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.loadFlavours();
    this.loadOrders();
    this.orderSvc.getAllOrders().subscribe((orders: any[]) => {
      this.gelatoOrders = orders;
      this.gelatoOrders.forEach((order) => {
        this.showDetailsForOrders[order.id] = false;
      });
    });
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

  loadOrders(): void {
    this.orderSvc.getAllOrders().subscribe((data) => {
      this.gelatoOrders = data;
    });
  }

  toggleDetails(orderId: number): void {
    //SE L'ORDINE E' GIA' SELEZIONATO, LO DESELEZIONO E NASCONDO I DETTAGLI
    if (this.selectedOrderId === orderId) {
      this.selectedOrderId = null;
      this.showDetailsForOrders[orderId] = false;
    } else {
      // NASCONDE I DETTAGLI DI TUTTI GLI ORDINI
      this.gelatoOrders.forEach((order) => {
        this.showDetailsForOrders[order.id] = false;
      });

      this.selectedOrderId = orderId;
      this.showDetailsForOrders[orderId] = true;
    }
  }
}
