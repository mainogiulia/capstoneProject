import { Component, OnInit } from '@angular/core';
import { iFlavour } from '../../interfaces/i-flavour';
import { GelatoService } from '../../services/gelato.service';
import { PayPalService } from '../../services/pay-pal.service';
declare var bootstrap: any;

@Component({
  selector: 'app-gelato',
  templateUrl: './gelato.component.html',
  styleUrl: './gelato.component.scss',
})
export class GelatoComponent implements OnInit {
  flavours: iFlavour[] = [];
  cart: iFlavour[] = [];
  paymentStatus: string = '';

  constructor(
    private gelatoSvc: GelatoService,
    private payPalSvc: PayPalService
  ) {}

  ngOnInit(): void {
    this.gelatoSvc.getFlavours().subscribe((data) => {
      this.flavours = data;
    });
  }

  addToOrder(flavour: iFlavour): void {
    this.cart.push(flavour);
    console.log('Aggiunto al carrello: ', flavour.name);
  }

  viewCart(): void {
    console.log('Contenuto del carrello: ', this.cart);
  }

  openOffcanvas() {
    const offcanvasElement = document.getElementById('offcanvasRight');
    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.show();
  }

  // CREO L'ORDINE PAYPAL
  createOrder(): void {
    this.payPalSvc.createOrder().subscribe({
      next: (response) => {
        const approvalUrl = response.approvalUrl;
        console.log('URL di approvazione PayPal:', approvalUrl);
        window.location.href = approvalUrl; // Reindirizza l'utente
      },
      error: (error) => {
        console.error("Errore durante la creazione dell'ordine PayPal:", error);
        alert(`Si è verificato un errore: ${error.message}`);
      },
      complete: () => {
        console.log('Creazione ordine PayPal completata');
      },
    });
  }

  // CATTURO IL PAGAMENTO DOPO CHE L'UTENTE HA APROVATO SU PAYPAL
  capturePayPalOrder(token: string): void {
    this.payPalSvc.captureOrder(token).subscribe({
      next: (result) => {
        console.log('Pagamento completato!', result);
        this.paymentStatus = 'success';
      },
      error: (error) => {
        console.error('Errore durante la cattura del pagamento:', error);
        this.paymentStatus = 'error';
      },
      complete: () => {
        console.log('Cattura pagamento completata');
      },
    });
  }
}
