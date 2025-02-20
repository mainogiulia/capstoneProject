import { Component, OnInit } from '@angular/core';
import { iFlavour } from '../../interfaces/i-flavour';
import { GelatoService } from '../../services/gelato.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
    imagePath: '',
  };

  errorMessage: string = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private gelatoSvc: GelatoService,
    private router: Router,
    private http: HttpClient
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

  // GESTISCO LA SELEZIONE DELL'IMMAGINE
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (!this.flavour.name || !this.flavour.type) {
      this.errorMessage = 'Nome e tipo sono obbligatori!';
      return;
    }
    // SE E' STATA SELEZIONATA UN'IMMAGINE, CARICALA PRIMA

    if (this.selectedFile) {
      this.gelatoSvc.uploadImage(this.selectedFile).subscribe({
        next: (imagePath) => {
          this.flavour.imagePath = imagePath;

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
        },
        error: (error) => {
          this.errorMessage = "Errore nel caricamento dell'immagine.";
          console.error(error);
        },
      });
    } else {
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

  onFileSelected(fileEvent: Event) {
    console.log(fileEvent);

    const input = fileEvent.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.http
      .post<{ imageUrl: string }>(
        'http://localhost:8080/api/flavour/upload',
        formData
      )
      .subscribe({
        next: (response) => {
          console.log('Immagine caricata con successo:', response.imageUrl);
          this.flavour.imagePath = response.imageUrl; // Salva l'URL dell'immagine
          this.imagePreview = response.imageUrl; // Aggiorna l'anteprima
        },
        error: (err) => {
          console.error('Errore durante il caricamento:', err);
        },
      });
  }
}
