import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PayPalService } from '../../services/pay-pal.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss',
})
export class PaymentSuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private payPalSvc: PayPalService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      // CATTURA L'ORDINE DI PAYPAL
      this.payPalSvc.captureOrder(token).subscribe({
        next: (result) => {
          console.log('Pagamento completato!', result);
        },
        error: (error) => {
          console.error('Errore durante la cattura del pagamento:', error);
        },
        complete: () => {
          console.log('Cattura del pagamento completata');
        },
      });
    }
  }
}
