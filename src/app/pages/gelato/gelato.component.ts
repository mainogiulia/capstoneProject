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
  creamFlavours: iFlavour[] = [];
  fruitFlavours: iFlavour[] = [];
  paymentStatus: string = '';

  constructor(
    private gelatoSvc: GelatoService,
    private payPalSvc: PayPalService
  ) {}

  ngOnInit(): void {
    this.gelatoSvc.getFlavours().subscribe((data) => {
      this.flavours = data;
      this.creamFlavours = this.flavours.filter((f) => f.type === 'CREMA');
      this.fruitFlavours = this.flavours.filter((f) => f.type === 'FRUTTA');
    });
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  addToOrder(flavour: iFlavour): void {
    this.cart.push(flavour);
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
  }

  openOffcanvas() {
    const offcanvasElement = document.getElementById('offcanvasRight');
    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.show();
  }

  removeFromOrder(flavour: iFlavour): void {
    const index = this.cart.findIndex((item) => item.name === flavour.name);

    if (index !== -1) {
      this.cart.splice(index, 1);
      sessionStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  clearCart(): void {
    this.cart = [];
    sessionStorage.removeItem('cart');
  }

  // CREO L'ORDINE PAYPAL
  createOrder(): void {
    const totalScoops = this.cart.length; // CONTA IL NUMERO DI PALLINE NEL CARRELLO

    this.payPalSvc.createOrder(totalScoops).subscribe({
      next: (response) => {
        const approvalUrl = response.approvalUrl;
        window.location.href = approvalUrl; // REINDIRIZZA L'UTENTE ALLA RISPOSTA DI PAYPAL
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
      next: (response) => {
        if (response.status === 'success') {
          alert(
            'Pagamento completato con successo! ID transazione: ' +
              response.transactionId
          );
        } else {
          alert('Errore nel pagamento: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Errore durante la cattura del pagamento:', error);
        // Qui puoi esplorare l'errore in dettaglio
        if (error.error && error.error.details) {
          console.error('Dettagli errore:', error.error.details);
        }
        this.paymentStatus = 'error';
        alert(
          'Si è verificato un errore nel completamento del pagamento: ' +
            error.message
        );
      },
      complete: () => {
        console.log('Cattura pagamento completata');
      },
    });
  }
}
