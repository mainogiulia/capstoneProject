import { Component } from '@angular/core';
import { GelatoService } from '../../services/gelato.service';
import { iFlavour } from '../../interfaces/i-flavour';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  flavourForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  flavourTypes: ('CREMA' | 'FRUTTA')[] = ['CREMA', 'FRUTTA'];

  constructor(
    private fb: FormBuilder,
    private gelatoSvc: GelatoService,
    private router: Router
  ) {
    this.flavourForm = this.fb.group({
      name: [''],
      type: [''],
      description: [''],
      image: [''],
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
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('name', this.flavourForm.get('name')?.value);
    const flavourType = this.flavourForm.get('type')?.value;
    console.log('Selected Type:', flavourType);
    formData.append('type', flavourType);
    formData.append('description', this.flavourForm.get('description')?.value);
    formData.append('image', this.selectedFile);

    this.gelatoSvc.createFlavour(formData).subscribe({
      next: (response) => {
        console.log('Flavour created:', response);

        this.flavourForm.reset();
      },
      error: (error) => console.error('Upload failed:', error),
      complete: () => console.log('Upload complete!'),
    });
  }
}
