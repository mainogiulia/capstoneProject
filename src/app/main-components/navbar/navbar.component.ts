import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(private authSvc: AuthService) {}

  isLoggedIn: boolean = false;

  animationUp: string = 'translateY(0)';

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.scrollY > 150) {
      this.animationUp = 'translateY(-100px)';
    } else {
      this.animationUp = 'translateY(0)';
    }
  }

  ngOnInit() {
    this.authSvc.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  logout(): void {
    this.authSvc.logout();
    this.isLoggedIn = false;
  }
}
