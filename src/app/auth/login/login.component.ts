import { Component } from '@angular/core';
import { iLoginRequest } from '../../interfaces/i-login-request';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formData: iLoginRequest = {
    username: '',
    password: '',
  };

  isPasswordVisible = false;
  errorMessage: string = '';
  showError: boolean = false;

  constructor(private authSvc: AuthService, private router: Router) {}

  login() {
    // Reset any previous errors
    this.showError = false;
    this.errorMessage = '';

    // Verifica se i campi sono vuoti
    if (!this.formData.username.trim()) {
      this.showError = true;
      this.errorMessage = 'Inserisci il tuo username.';
      return;
    }

    if (!this.formData.password.trim()) {
      this.showError = true;
      this.errorMessage = 'Inserisci la tua password.';
      return;
    }

    this.authSvc.login(this.formData).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.showError = true;
        console.error('Login error', err);

        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Username o password non corretti. Riprova.';
        } else if (err.status === 0) {
          this.errorMessage =
            'Impossibile connettersi al server. Verifica la tua connessione.';
        } else {
          this.errorMessage = 'Si è verificato un errore. Riprova più tardi.';
        }
      },
    });
  }
  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
