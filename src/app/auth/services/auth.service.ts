import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, map, tap } from 'rxjs';
import { iAccessData } from '../../interfaces/i-access-data';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { iUser } from '../../interfaces/i-user';
import { iLoginRequest } from '../../interfaces/i-login-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  registerUrl: string = environment.registerUrl;
  loginUrl: string = environment.loginUrl;

  authSubject$ = new BehaviorSubject<iAccessData | null>(null); //NULL E' IL VALORE DI DEFAULT, QUINDI SI PARTE CON UTENTE NON LOGGATO
  isLoggedIn: boolean = false;
  private autoLogoutTimer: any; // RIFERIMENTO AL TIMER CHE SLOGGA L'UTENTE QUANDO IL TOKEN E' SCADUTO

  user$ = this.authSubject$
    .asObservable() //CONTIENE DATI SULL'UTENTE SE E' LOGGATO
    .pipe(
      tap((accessData) => (this.isLoggedIn = !!accessData)),
      map((accessData) => {
        return accessData ? accessData.user : null;
      })
    );

  isLoggedIn$ = this.authSubject$
    .asObservable()
    .pipe(map((accessData) => !!accessData)); //SERVE PER LA VERIFICA, CAPTA LA PRESENZA O MENO DELLO USER E MI RESTITUISCE false SE IL SUBJECT RICEVE NULL

  constructor(
    private http: HttpClient, //PER LE CHIAMATE HTTP
    private router: Router //PER I REDIRECT
  ) {
    const savedAccessData = localStorage.getItem('accessData'); // RECUPERA I DATI DAL LOCALSTORAGE

    if (savedAccessData) {
      const parsedData: iAccessData = JSON.parse(savedAccessData);
      this.authSubject$.next(parsedData); // RIPRISTINA I DATI DELL'UTENTE
    }
  }

  register(newUser: Partial<iUser>) {
    return this.http.post<iAccessData>(this.registerUrl, newUser);
  }

  login(authData: iLoginRequest) {
    return this.http.post<iAccessData>(this.loginUrl, authData).pipe(
      tap((accessData) => {
        this.authSubject$.next(accessData); //INVIO LO USER AL SUBJECT
        localStorage.setItem('accessData', JSON.stringify(accessData)); //SALVO LO USER PER POTERLO RECUPERARE SE SI E' RICARICATA LA PAGINA

        const expirationTime = this.getTokenExpiration(accessData.accessToken);
        if (expirationTime) this.startTokenExpirationTimer(expirationTime);
      })
    );
  }

  logout() {
    this.authSubject$.next(null); //COMUNICO AL BEHAVIOUR SUBJECT CHE IL VALORE DA PROPAGARE E' null
    localStorage.removeItem('accessData'); //ELIMINO I DATI SALVATI IN LOCAL STORAGE
    if (this.autoLogoutTimer) clearTimeout(this.autoLogoutTimer); // CANCELLO IL TIMER SE ESISTE
    this.router.navigate(['/auth/login']); //REDIRECT AL LOGIN
  }

  private getTokenExpiration(accessToken: string): number | null {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1])); // DECODIFICA IL PAYLOAD DEL TOKEN
      return payload.exp ? payload.exp * 1000 : null; // CONVERTE IN ms
    } catch {
      return null;
    }
  }

  private startTokenExpirationTimer(expirationTime: number): void {
    const timeout = expirationTime - Date.now();

    if (timeout <= 0) {
      this.logout();
      return;
    }

    if (this.autoLogoutTimer) clearTimeout(this.autoLogoutTimer); // CANCELLA EVENTUALI TIMER PRECEDENTI

    this.autoLogoutTimer = setTimeout(() => {
      this.logout();
    }, timeout);
  }
}
