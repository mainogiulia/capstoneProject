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
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private gelatoSvc: GelatoService, private router: Router) {}

  //GESTISCO LA SELEZIONE DI UN FILE TRAMITE IL CAMPO INPUT FILE
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log('File input change:', input.files);

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log(
        'File selezionato:',
        this.selectedFile.name,
        this.selectedFile.size
      );

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        console.log('Anteprima generata');
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      console.log('Nessun file selezionato o operazione annullata');
    }
  }

  onImageUpload(file: File) {
    if (!this.selectedFile) {
      console.error('Nessun file selezionato!');
      return;
    }
    this.gelatoSvc.uploadImage(this.selectedFile).subscribe({
      next: (imagePath: string) => {
        console.log('Immagine caricata, percorso restituito:', imagePath);
        this.newFlavour.imagePath = imagePath;
        this.createFlavour();
      },
      error: (error) => {
        console.error("Errore nel caricamento dell'immagine", error);
      },
    });
  }

  onSubmit(): void {
    console.log('Form inviato', this.newFlavour);

    if (!this.newFlavour.name || !this.newFlavour.type) {
      this.errorMessage = 'Nome e tipo sono obbligatori!';
      return;
    }

    // SE E' STATO SELEZIONATO UN FILE, CARICALO PRIMA DI INVIARE IL GUSTO
    if (this.selectedFile) {
      this.uploadImageAndCreateFlavour();
    } else {
      console.log('Nessuna immagine, creo direttamente il gusto');
      this.createFlavour();
    }
  }

  private uploadImageAndCreateFlavour(): void {
    if (!this.selectedFile) return;

    this.gelatoSvc.uploadImage(this.selectedFile).subscribe({
      next: (imagePath: string) => {
        console.log('Immagine caricata, percorso restituito:', imagePath);
        this.newFlavour.imagePath = imagePath;
        this.createFlavour();
      },
      error: (error) => {
        this.errorMessage = "Errore nell'upload dell'immagine.";
        console.error("Errore nel caricamento dell'immagine", error);
      },
    });
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
