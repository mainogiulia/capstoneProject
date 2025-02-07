import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GelatoOrderService } from '../../services/gelato-order.service';
import { iGelatoOrder } from '../../interfaces/i-gelato-order';

@Component({
  selector: 'app-gelato-order',
  templateUrl: './gelato-order.component.html',
  styleUrl: './gelato-order.component.scss',
})
export class GelatoOrderComponent {
  // orderForm: FormGroup;
  // constructor(private fb: FormBuilder, private gelatoOrderSvc: GelatoOrderService) {
  //   this.orderForm = this.fb.group({
  //     appUserId: ['', Validators.required],
  //     costumerName: ['', [Validators.required, Validators.minLength(2)]],
  //     email: ['', [Validators.required, Validators.email]],
  //     orderDate: ['', Validators.required],
  //     deliveryAddress: ['', Validators.required],
  //     details: this.fb.array([]),
  //   });
  // }
  // onSubmit() {
  //   if (this.orderForm.invalid) {
  //     return;
  //   }
  //   const orderData: iGelatoOrder = this.orderForm.value;
  //   this.gelatoOrderSvc.createOrder(orderData).subscribe(
  //     (response) => {
  //       console.log('Ordine creato con successo', response);
  //       // Gestisci la risposta, ad esempio, mostra un messaggio di conferma
  //     },
  //     (error) => {
  //       console.error('Errore durante la creazione dell\'ordine', error);
  //       // Gestisci gli errori, ad esempio, mostra un messaggio di errore
  //     }
  //   );
  // }
}
