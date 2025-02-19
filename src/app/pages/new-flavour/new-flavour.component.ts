import { Component } from '@angular/core';
import { GelatoService } from '../../services/gelato.service';
import { iFlavour } from '../../interfaces/i-flavour';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-flavour',
  templateUrl: './new-flavour.component.html',
  styleUrl: './new-flavour.component.scss',
})
export class NewFlavourComponent {
  newFlavour: iFlavour = {
    name: '',
    type: 'CREMA', //DEFAULT POI ADMIN LO CAMBIA DAL FORM
    description: '',
  };

  errorMessage: string = '';

  constructor(private gelatoSvc: GelatoService, private router: Router) {}

  onSubmit(): void {
    if (!this.newFlavour.name || !this.newFlavour.type) {
      this.errorMessage = 'Nome e tipo sono obbligatori!';
      return;
    }

    this.gelatoSvc.createFlavour(this.newFlavour).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = 'Errore nella creazione del gusto.';
        console.error(error);
      },
    });
  }
}
