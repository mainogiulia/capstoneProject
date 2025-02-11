import { Component, OnInit } from '@angular/core';
import { iFlavour } from '../../interfaces/i-flavour';
import { GelatoOrderService } from '../../services/gelato-order.service';
declare var bootstrap: any;

@Component({
  selector: 'app-gelato-order',
  templateUrl: './gelato-order.component.html',
  styleUrl: './gelato-order.component.scss',
})
export class GelatoOrderComponent implements OnInit {
  flavours: iFlavour[] = [];
  cart: iFlavour[] = [];

  constructor(private gelatoSvc: GelatoOrderService) {}

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
}
