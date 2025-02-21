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
  paymentStatus: string = '';
  imagePreview: string | null = null;
  orderId: string = '';
  orderForm!: FormGroup;

  constructor(
    private gelatoSvc: GelatoService,
    private payPalSvc: PayPalService,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      date: ['null', Validators.required],
    });
  }

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

    const savedFormData = sessionStorage.getItem('orderFormData');
    if (savedFormData) {
      this.orderForm.setValue(JSON.parse(savedFormData));
    }

    this.gelatoSvc.currentImage$.subscribe((image) => {
      this.imagePreview = image;
    });
  }

  // SALVA I DATI DEL FORM NEL SESSION STORAGE QUANDO CAMBIANO
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
  createOrder(): void {
    // VERIFICA SE IL FORM E' VALIDO
    if (this.orderForm.invalid) {
      alert('Per favore, compila tutti i campi richiesti');
      return;
    }
    const totalScoops = this.cart.length;

    // PREPARA I DATI DELL'ORDINE
    const orderData = {
      costumerName: this.orderForm.get('name')?.value,
      email: this.orderForm.get('email')?.value,
      orderDate: new Date(),
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

    // SALVA I DATI DELL'ORDINE NEL SESSION STORAGE
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
  capturePayPalOrder(token: string): void {
    // RECUPERA L'ID DELL'ORDINE DAL SESSION STORAGE
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
          this.clearCart();
          sessionStorage.removeItem('currentOrderId');
        } else {
          alert('Errore nel pagamento: ' + response.message);
        }
      },
    });
  }
}
