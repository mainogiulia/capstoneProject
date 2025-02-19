import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessData = localStorage.getItem('accessData');
    let token: string | null = null;

    if (accessData) {
      try {
        token = JSON.parse(accessData).accessToken;
      } catch (error) {
        console.error('Errore nel parsing del token:', error);
      }
    }

    let modifiedRequest = request;
    if (token) {
      modifiedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authSvc.logout(); // RIMUOVE IL TOKEN E DISCONNETTE L'UTENTE
        }
        return throwError(() => error); // RILANCIA L'ERRORE PER LA GESTIONE
      })
    );
  }
}
