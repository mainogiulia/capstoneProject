import { Component, OnInit } from '@angular/core';
import { iFlavour } from '../../interfaces/i-flavour';
import { GelatoService } from '../../services/gelato.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-flavour',
  templateUrl: './edit-flavour.component.html',
  styleUrl: './edit-flavour.component.scss',
})
export class EditFlavourComponent implements OnInit {
  flavour: iFlavour = {
    name: '',
    type: 'CREMA',
    description: '',
  };

  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private gelatoSvc: GelatoService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id')); // PRENDE L'ID DALL'URL
    if (!id) {
      this.errorMessage = 'ID non valido';
      return;
    }

    this.gelatoSvc.getFlavourById(id).subscribe({
      next: (flavourData) => {
        this.flavour = flavourData; // RIEMPIE IL FORM CON I DATI DEL GUSTO SELEZIONATO
      },
      error: (error) => {
        this.errorMessage = 'Errore nel caricamento dei dati.';
        console.error(error);
      },
    });
  }

  onSubmit(): void {
    if (!this.flavour.name || !this.flavour.type) {
      this.errorMessage = 'Nome e tipo sono obbligatori!';
      return;
    }

    this.gelatoSvc
      .editFlavour(this.flavour.id as number, this.flavour)
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = 'Errore nella modifica del gusto.';
          console.error(error);
        },
      });
  }
}
