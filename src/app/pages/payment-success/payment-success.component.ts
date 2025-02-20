import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PayPalService } from '../../services/pay-pal.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss',
})
export class PaymentSuccessComponent implements OnInit {
  processing = true;
  completed = false;
  error = false;
  errorMessage = '';
  customerEmail = '';
  orderFlavours: any[] = [];
  //////////////////////////////////////////////////////////////
  constructor(
    private route: ActivatedRoute,
    private router: Router, /////////////////////////////////////////
    private payPalSvc: PayPalService
  ) {}

  ngOnInit(): void {
    //   const token = this.route.snapshot.queryParamMap.get('token');

    //   if (token) {
    //     // CATTURA L'ORDINE DI PAYPAL
    //     this.payPalSvc.captureOrder(token).subscribe({
    //       next: (result) => {
    //         console.log('Pagamento completato!', result);
    //       },
    //       error: (error) => {
    //         console.error('Errore durante la cattura del pagamento:', error);
    //       },
    //       complete: () => {
    //         console.log('Cattura del pagamento completata');
    //       },
    //     });
    //   }
    // }

    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const orderId = sessionStorage.getItem('currentOrderId');

      // Recupera i dati dell'ordine dal sessionStorage
      const pendingOrderData = sessionStorage.getItem('pendingOrderData');
      if (pendingOrderData) {
        const orderData = JSON.parse(pendingOrderData);
        this.customerEmail = orderData.email;

        // Recupera i gusti dal carrello
        const cartData = sessionStorage.getItem('cart');
        if (cartData) {
          this.orderFlavours = JSON.parse(cartData);
        }
      }

      if (token && orderId) {
        this.payPalSvc.captureOrder(token, orderId).subscribe({
          next: (response) => {
            this.processing = false;
            if (response.status === 'success') {
              this.completed = true;
              // Pulisci i dati della sessione dopo il completamento
              sessionStorage.removeItem('cart');
              sessionStorage.removeItem('currentOrderId');
              sessionStorage.removeItem('pendingOrderData');
              sessionStorage.removeItem('orderFormData');
            } else {
              this.error = true;
              this.errorMessage = response.message;
            }
          },
          error: (error) => {
            this.processing = false;
            this.error = true;
            this.errorMessage =
              error.message ||
              'Si è verificato un errore durante il pagamento.';
          },
        });
      } else {
        this.processing = false;
        this.error = true;
        this.errorMessage =
          'Dati di pagamento mancanti. Impossibile completare la transazione.';
      }
    });
  }
}
