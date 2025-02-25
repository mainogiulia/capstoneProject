import { Component, OnInit } from '@angular/core';
import { iFlavour } from '../../interfaces/i-flavour';
import { GelatoService } from '../../services/gelato.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

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
}
