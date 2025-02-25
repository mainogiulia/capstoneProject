import { Component, OnInit } from '@angular/core';
import { iFlavour } from '../../interfaces/i-flavour';
import { GelatoService } from '../../services/gelato.service';
import { PayPalService } from '../../services/pay-pal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iCartItem } from '../../interfaces/i-cart-item';
declare var bootstrap: any;

@Component({
  selector: 'app-gelato',
  templateUrl: './gelato.component.html',
  styleUrl: './gelato.component.scss',
})
export class GelatoComponent implements OnInit {
  flavours: iFlavour[] = [];
  cart: iCartItem[] = [];
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
      datetime: ['null', Validators.required],
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
    const existingItem = this.cart.find(
      (item) => item.flavour.id === flavour.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ flavour, quantity: 1 });
    }

    sessionStorage.setItem('cart', JSON.stringify(this.cart));
  }

  decreaseQuantity(cartItem: iCartItem): void {
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
    } else {
      this.removeFromOrder(cartItem.flavour);
      return;
    }

    sessionStorage.setItem('cart', JSON.stringify(this.cart));
  }

  openOffcanvas() {
    const offcanvasElement = document.getElementById('offcanvasRight');
    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.show();
  }

  removeFromOrder(flavour: iFlavour): void {
    const index = this.cart.findIndex((item) => item.flavour.id === flavour.id);

    if (index !== -1) {
      this.cart.splice(index, 1);
      sessionStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  getTotalItems(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cart.reduce((total, item) => total + item.quantity * 2, 0);
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
    const totalScoops = this.getTotalItems();

    // PREPARA I DATI DELL'ORDINE
    const selectedDateTime = this.orderForm.get('datetime')?.value;

    const orderDate = {
      costumerName: this.orderForm.get('name')?.value,
      email: this.orderForm.get('email')?.value,
      orderDate: selectedDateTime,
      details: [
        {
          totalScoops: totalScoops,
          scoopQuantities: this.cart.map((item) => ({
            flavourId: item.flavour.id,

            numberOfScoops: item.quantity,
          })),
        },
      ],
    };

    // SALVA I DATI DELL'ORDINE NEL SESSION STORAGE
    sessionStorage.setItem('pendingOrderData', JSON.stringify(orderDate));

    this.payPalSvc.createOrder(totalScoops, orderDate).subscribe({
      next: (response) => {
        this.orderId = response.orderId;
        sessionStorage.setItem('currentOrderId', this.orderId);
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
