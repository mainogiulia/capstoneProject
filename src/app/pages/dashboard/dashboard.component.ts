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
  successMessage: string = '';
  errorToastMessage: string = '';
  notificationMessage: string = '';
  isSuccessFading: boolean = false;
  isErrorToastFading: boolean = false;
  isNotificationFading: boolean = false;
  showConfirmDialog: boolean = false;
  confirmMessage: string = '';
  confirmCallback: (() => void) | null = null;

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
        if (data.length === 0) {
          this.showNotification('Non ci sono prenotazioni.');
        }
      },
      error: (error) => {
        this.showError('Errore nel recupero delle prenotazioni.');
        console.error(error);
      },
    });
  }

  deleteReservation(id: number): void {
    this.openConfirmDialog(
      'Sei sicuro di voler eliminare questa prenotazione?',
      () => {
        this.reservationSvc.deleteReservation(id).subscribe({
          next: () => {
            this.reservations = this.reservations.filter(
              (res) => res.id !== id
            );
            this.showSuccess('Prenotazione eliminata con successo!');
          },
          error: (error) => {
            console.error(
              "Errore nell'eliminazione della prenotazione:",
              error
            );
            this.showErrorToast('Impossibile eliminare la prenotazione.');
          },
        });
      }
    );
  }

  //GUSTI
  loadFlavours(): void {
    this.gelatoSvc.getFlavours().subscribe({
      next: (data) => {
        this.flavours = data;
        if (data.length === 0) {
          this.showNotification('Non ci sono gusti disponibili.');
        }
      },
      error: (error) => {
        this.showError('Errore nel recupero dei gusti.');
        console.error(error);
      },
    });
  }

  deleteFlavour(id: number): void {
    this.openConfirmDialog(
      'Sei sicuro di voler eliminare questo gusto?',
      () => {
        this.gelatoSvc.deleteFlavour(id).subscribe({
          next: () => {
            this.flavours = this.flavours.filter((res) => res.id !== id);
            this.showSuccess('Gusto eliminato con successo!');
          },
          error: (error) => {
            console.error("Errore nell'eliminazione del gusto:", error);
            this.showErrorToast('Impossibile eliminare il gusto.');
          },
        });
      }
    );
  }

  loadOrders(): void {
    this.orderSvc.getAllOrders().subscribe((data) => {
      this.gelatoOrders = data;
    });
  }

  clearSuccessMessage(): void {
    this.isSuccessFading = true;
    setTimeout(() => {
      this.successMessage = '';
      this.isSuccessFading = false;
    }, 300);
  }

  clearErrorToastMessage(): void {
    this.isErrorToastFading = true;
    setTimeout(() => {
      this.errorToastMessage = '';
      this.isErrorToastFading = false;
    }, 300);
  }

  clearNotificationMessage(): void {
    this.isNotificationFading = true;
    setTimeout(() => {
      this.notificationMessage = '';
      this.isNotificationFading = false;
    }, 300);
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
  }

  // Metodi per mostrare i messaggi
  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.clearSuccessMessage(), 5000);
  }

  showErrorToast(message: string): void {
    this.errorToastMessage = message;
    setTimeout(() => this.clearErrorToastMessage(), 5000);
  }

  showNotification(message: string): void {
    this.notificationMessage = message;
    setTimeout(() => this.clearNotificationMessage(), 5000);
  }

  showError(message: string): void {
    this.errorMessage = message;
  }
  openConfirmDialog(message: string, callback: () => void): void {
    this.confirmMessage = message;
    this.confirmCallback = callback;
    this.showConfirmDialog = true;
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).className === 'confirm-dialog-backdrop') {
      this.showConfirmDialog = false;
    }
  }

  onCancelConfirm(): void {
    this.showConfirmDialog = false;
  }

  onConfirm(): void {
    this.showConfirmDialog = false;
    if (this.confirmCallback) {
      this.confirmCallback();
    }
  }
}
