import { Component, OnInit } from '@angular/core';
import { iFlavour } from '../../interfaces/i-flavour';
import { GelatoService } from '../../services/gelato.service';
import { PayPalService } from '../../services/pay-pal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  paymentStatus: string = ''; ////////////////////////////////////////////////
  imagePreview: string | null = null;
  orderId: string = ''; ///////////////////////////////////////////
  orderForm!: FormGroup; /////////////////////////////////

  constructor(
    private gelatoSvc: GelatoService,
    private payPalSvc: PayPalService,
    private fb: FormBuilder //////////////////////////////////////
  ) {
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
    });
  } ///////////////////////////////////////////////////

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

    const savedFormData = sessionStorage.getItem('orderFormData'); ///////////////////////////////////////
    if (savedFormData) {
      this.orderForm.setValue(JSON.parse(savedFormData));
    } ///////////////////////////////////////////////////////////////

    this.gelatoSvc.currentImage$.subscribe((image) => {
      this.imagePreview = image; // Aggiorniamo l'immagine nel componente
    });
  }

  // Salva i dati del form nel sessionStorage quando cambiano////////////////////////////////////////////////
  saveFormData(): void {
    if (this.orderForm.valid) {
      sessionStorage.setItem(
        'orderFormData',
        JSON.stringify(this.orderForm.value)
      );
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
  // createOrder(): void {
  //   const totalScoops = this.cart.length; // CONTA IL NUMERO DI PALLINE NEL CARRELLO

  //   this.payPalSvc.createOrder(totalScoops).subscribe({
  //     next: (response) => {
  //       const approvalUrl = response.approvalUrl;
  //       window.location.href = approvalUrl; // REINDIRIZZA L'UTENTE ALLA RISPOSTA DI PAYPAL
  //     },
  //     error: (error) => {
  //       console.error("Errore durante la creazione dell'ordine PayPal:", error);
  //       alert(`Si è verificato un errore: ${error.message}`);
  //     },
  //     complete: () => {
  //       console.log('Creazione ordine PayPal completata');
  //     },
  //   });
  // }

  createOrder(): void {
    // Verifica se il form è valido
    if (this.orderForm.invalid) {
      alert('Per favore, compila tutti i campi richiesti');
      return;
    }
    const totalScoops = this.cart.length;

    // Prepara i dati dell'ordine
    const orderData = {
      costumerName: this.orderForm.get('name')?.value,
      email: this.orderForm.get('email')?.value,
      orderDate: new Date(),
      deliveryAddress: this.orderForm.get('address')?.value,
      details: [
        {
          totalScoops: totalScoops,
          scoopQuantities: this.cart.map((flavour) => ({
            flavourId: flavour.id,
            numberOfScoops: 1,
          })),
        },
      ],
    };

    // Salva i dati dell'ordine in sessionStorage per recuperarli dopo il pagamento
    sessionStorage.setItem('pendingOrderData', JSON.stringify(orderData));

    this.payPalSvc.createOrder(totalScoops, orderData).subscribe({
      next: (response) => {
        this.orderId = response.orderId; // Salva l'ID dell'ordine
        sessionStorage.setItem('currentOrderId', this.orderId); // Salva in sessionStorage
        window.location.href = response.approvalUrl;
      },
      error: (error) => {
        console.error("Errore durante la creazione dell'ordine PayPal:", error);
        alert(`Si è verificato un errore: ${error.message}`);
      },
    });
  }

  // CATTURO IL PAGAMENTO DOPO CHE L'UTENTE HA APROVATO SU PAYPAL
  // capturePayPalOrder(token: string): void {
  //   this.payPalSvc.captureOrder(token).subscribe({
  //     next: (response) => {
  //       if (response.status === 'success') {
  //         alert(
  //           'Pagamento completato con successo! ID transazione: ' +
  //             response.transactionId
  //         );
  //       } else {
  //         alert('Errore nel pagamento: ' + response.message);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Errore durante la cattura del pagamento:', error);
  //       // Qui puoi esplorare l'errore in dettaglio
  //       if (error.error && error.error.details) {
  //         console.error('Dettagli errore:', error.error.details);
  //       }
  //       this.paymentStatus = 'error';
  //       alert(
  //         'Si è verificato un errore nel completamento del pagamento: ' +
  //           error.message
  //       );
  //     },
  //     complete: () => {
  //       console.log('Cattura pagamento completata');
  //     },
  //   });
  // }

  capturePayPalOrder(token: string): void {
    // Recupera l'ID dell'ordine dal sessionStorage
    const orderId = sessionStorage.getItem('currentOrderId');

    if (!orderId) {
      alert('Errore: ID ordine non trovato');
      return;
    }

    this.payPalSvc.captureOrder(token, orderId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          alert(
            'Pagamento completato con successo! ID transazione: ' +
              response.transactionId
          );
          this.clearCart(); // Svuota il carrello dopo il pagamento riuscito
          sessionStorage.removeItem('currentOrderId'); // Rimuovi l'ID dell'ordine
        } else {
          alert('Errore nel pagamento: ' + response.message);
        }
      },
      // ... resto del codice di gestione errori ...
    });
  }
}
