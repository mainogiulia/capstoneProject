import { Component } from '@angular/core';
import { PayPalService } from '../../services/pay-pal.service';

@Component({
  selector: 'app-gelato-order',
  templateUrl: './gelato-order.component.html',
  styleUrl: './gelato-order.component.scss',
})
export class GelatoOrderComponent {
  constructor(private payPalService: PayPalService) {}

  ngOnInit(): void {
    this.createPayPalOrder();
  }

  createPayPalOrder(): void {
    this.payPalService.createOrder().subscribe({
      next: (response) => {
        // SUCCESS: REDIRIGE L'UTENTE ALLA PAGINA DI PAGAMENTO DI PAYPAL
        const approvalUrl = response.approvalUrl;
        window.location.href = approvalUrl;
      },
      error: (error) => {
        // ERRORE: MOSTRA UN ALERT
        alert('Si è verificato un errore: ' + error);
        console.error('Errore PayPal:', error);
      },
    });
  }
}
