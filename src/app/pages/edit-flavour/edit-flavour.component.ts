import { Component, OnInit } from '@angular/core';
import { iFlavour } from '../../interfaces/i-flavour';
import { GelatoService } from '../../services/gelato.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  flavourId: number = 0;
  currentFlavour: iFlavour | null = null;
  errorMessage: string = '';
  selectedFile: File | null = null;
  flavourForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  flavourTypes: ('CREMA' | 'FRUTTA')[] = ['CREMA', 'FRUTTA'];

  constructor(
    private fb: FormBuilder,
    private gelatoSvc: GelatoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.flavourForm = this.fb.group({
      name: [''],
      type: [''],
      description: [''],
      image: [''],
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.flavourId = Number(params.get('id'));

      if (this.flavourId) {
        this.loadFlavourData();
      } else {
        this.errorMessage = 'ID gusto non trovato';
      }
    });
  }

  loadFlavourData(): void {
    if (!this.flavourId) {
      this.errorMessage = 'ID gusto non valido';
      return;
    }

    this.gelatoSvc.getFlavourById(this.flavourId).subscribe({
      next: (flavour) => {
        this.currentFlavour = flavour;
        this.flavourForm.patchValue({
          name: flavour.name,
          type: flavour.type,
          description: flavour.description,
        });
        if (flavour.imagePath) {
          this.imagePreview = flavour.imagePath;
        }
      },
      error: (error) => {
        console.error('Errore nel caricamento del gusto:', error);
        this.errorMessage = 'Errore nel caricamento del gusto';
      },
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submit() {
    if (!this.currentFlavour || !this.flavourId) {
      this.errorMessage =
        'Impossibile aggiornare: dati mancanti o ID non valido';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.flavourForm.get('name')?.value);
    formData.append('type', this.flavourForm.get('type')?.value);
    formData.append('description', this.flavourForm.get('description')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.gelatoSvc.editFlavour(this.flavourId, formData).subscribe({
      next: (response) => {
        console.log('Gusto aggiornato:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Aggiornamento fallito:', error);
        this.errorMessage = "Errore durante l'aggiornamento del gusto";
      },
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  //   ngOnInit() {
  //     const id = Number(this.route.snapshot.paramMap.get('id')); // PRENDE L'ID DALL'URL
  //     if (!id) {
  //       this.errorMessage = 'ID non valido';
  //       return;
  //     }

  //     this.gelatoSvc.getFlavourById(id).subscribe({
  //       next: (flavourData) => {
  //         this.flavour = flavourData; // RIEMPIE IL FORM CON I DATI DEL GUSTO SELEZIONATO
  //       },
  //       error: (error) => {
  //         this.errorMessage = 'Errore nel caricamento dei dati.';
  //         console.error(error);
  //       },
  //     });
  //   }

  //   // GESTISCO LA SELEZIONE DELL'IMMAGINE
  //   onImageChange(event: any): void {
  //     const file = event.target.files[0];
  //     if (file) {
  //       this.selectedFile = file;
  //     }
  //   }

  //   onSubmit(): void {
  //     if (!this.flavour.name || !this.flavour.type) {
  //       this.errorMessage = 'Nome e tipo sono obbligatori!';
  //       return;
  //     }
  //     // SE E' STATA SELEZIONATA UN'IMMAGINE, CARICALA PRIMA

  //     if (this.selectedFile) {
  //       this.gelatoSvc.uploadImage(this.selectedFile).subscribe({
  //         next: (imagePath) => {
  //           this.flavour.imagePath = imagePath;

  //           this.gelatoSvc
  //             .editFlavour(this.flavour.id as number, this.flavour)
  //             .subscribe({
  //               next: () => {
  //                 this.router.navigate(['/dashboard']);
  //               },
  //               error: (error) => {
  //                 this.errorMessage = 'Errore nella modifica del gusto.';
  //                 console.error(error);
  //               },
  //             });
  //         },
  //         error: (error) => {
  //           this.errorMessage = "Errore nel caricamento dell'immagine.";
  //           console.error(error);
  //         },
  //       });
  //     } else {
  //       this.gelatoSvc
  //         .editFlavour(this.flavour.id as number, this.flavour)
  //         .subscribe({
  //           next: () => {
  //             this.router.navigate(['/dashboard']);
  //           },
  //           error: (error) => {
  //             this.errorMessage = 'Errore nella modifica del gusto.';
  //             console.error(error);
  //           },
  //         });
  //     }
  //   }

  //   onFileSelected(fileEvent: Event) {
  //     console.log(fileEvent);

  //     const input = fileEvent.target as HTMLInputElement;
  //     if (!input.files || input.files.length === 0) return;

  //     const file = input.files[0];
  //     const formData = new FormData();
  //     formData.append('file', file);

  //     this.http
  //       .post<{ imageUrl: string }>(
  //         'http://localhost:8080/api/flavour/upload',
  //         formData
  //       )
  //       .subscribe({
  //         next: (response) => {
  //           console.log('Immagine caricata con successo:', response.imageUrl);
  //           this.flavour.imagePath = response.imageUrl; // Salva l'URL dell'immagine
  //           this.imagePreview = response.imageUrl; // Aggiorna l'anteprima
  //         },
  //         error: (err) => {
  //           console.error('Errore durante il caricamento:', err);
  //         },
  //       });
  //   }
  // }
}
