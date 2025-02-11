import { Component } from '@angular/core';
import { iLoginRequest } from '../../interfaces/i-login-request';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private authSvc: AuthService, private router: Router) {}

  login() {
    this.authSvc.login(this.formData).subscribe((data) => {
      this.router.navigate(['/dashboard']);
    });
  }

  isPasswordVisible = false;

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
