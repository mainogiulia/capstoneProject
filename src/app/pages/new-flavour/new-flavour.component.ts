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
    imagePath: '',
  };

  errorMessage: string = '';
  selectedFile: File | null = null;

  constructor(private gelatoSvc: GelatoService, private router: Router) {}

  //GESTISCO LA SELEZIONE DI UN FILE TRAMITE IL CAMPO INPUT FILE
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onImageUpload(file: File) {
    this.gelatoSvc.uploadImage(file).subscribe({
      next: (imagePath: string) => {
        this.newFlavour.imagePath = imagePath; // Salva il percorso dell'immagine caricato
      },
      error: (error) => {
        console.error("Errore nel caricamento dell'immagine", error);
      },
    });
  }

  onSubmit(): void {
    if (!this.newFlavour.name || !this.newFlavour.type) {
      this.errorMessage = 'Nome e tipo sono obbligatori!';
      return;
    }

    // SE E' STATO SELEZIONATO UN FILE, CARICALO PRIMA DI INVIARE IL GUSTO
    if (this.selectedFile) {
      this.gelatoSvc.uploadImage(this.selectedFile).subscribe({
        next: (imageUrl) => {
          this.newFlavour.imagePath = imageUrl;
          this.createFlavour();
        },
        error: (error) => {
          this.errorMessage = "Errore nell'upload dell'immagine.";
          console.error(error);
        },
      });
    } else {
      this.createFlavour();
    }
  }

  private createFlavour(): void {
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
