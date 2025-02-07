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

  authSubject$ = new BehaviorSubject<iAccessData | null>(null); //null è il valore di default, quindi si parte con utente non loggato

  user$ = this.authSubject$
    .asObservable() //contiene dati sull'utente se è loggato
    .pipe(
      tap((accessData) => (this.isLoggedIn = !!accessData)),
      map((accessData) => {
        return accessData ? accessData.user : null;
      })
    );

  isLoggedIn$ = this.authSubject$
    .asObservable()
    .pipe(map((accessData) => !!accessData)); //serve per la verifica, capta la presenza(o meno) dello user e mi restituisce un bool (false se il subject riceve null)

  isLoggedIn: boolean = false;

  constructor(
    private http: HttpClient, //per le chiamate http
    private router: Router //per i redirect
  ) {}

  register(newUser: Partial<iUser>) {
    return this.http.post<iAccessData>(this.registerUrl, newUser);
  }

  login(authData: iLoginRequest) {
    return this.http.post<iAccessData>(this.loginUrl, authData).pipe(
      tap((accessData) => {
        this.authSubject$.next(accessData); //invio lo user al subject
        localStorage.setItem('accessData', JSON.stringify(accessData)); //salvo lo user per poterlo recuperare se si ricarica la pagina
      })
    );
  }

  logout() {
    this.authSubject$.next(null); //comunico al behaviorsubject che il valore da propagare è null
    localStorage.removeItem('accessData'); //elimino i dati salvati in localstorage
    this.router.navigate(['/auth/login']); //redirect al login
  }
}
