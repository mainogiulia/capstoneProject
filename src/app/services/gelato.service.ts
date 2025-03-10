import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { iFlavour } from '../interfaces/i-flavour';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GelatoService {
  private imageSubject = new BehaviorSubject<string | null>(null);
  currentImage$ = this.imageSubject.asObservable();

  flavourUrl: string = environment.flavourUrl; // URL DEL BACKEND

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    //AGGIUNGO AUTOMATICAMENTE IL TOKEN DI AUTENTICAZIONE ALLA CHIAMATA HTTP
    const token = localStorage.getItem('accessData')
      ? JSON.parse(localStorage.getItem('accessData')!).token
      : null;
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  //RECUPERO TUTTI I GUSTI
  getFlavours(): Observable<iFlavour[]> {
    return this.http.get<iFlavour[]>(this.flavourUrl);
  }

  //RECUPERO I GUSTI PER ID (ADMIN)
  getFlavourById(id: number) {
    return this.http.get<iFlavour>(`${this.flavourUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  //CREO UN NUOVO GUSTO (ADMIN)
  createFlavour(newFlavour: FormData): Observable<iFlavour> {
    return this.http.post<iFlavour>(this.flavourUrl, newFlavour, {
      headers: this.getHeaders(),
    });
  }

  //MODIFICO UN GUSTO (ADMIN)
  editFlavour(id: number, formData: FormData) {
    return this.http.put<iFlavour>(`${this.flavourUrl}/${id}`, formData, {
      headers: this.getHeaders(),
    });
  }

  //ELIMINAZIONE GUSTO (ADMIN)
  deleteFlavour(id: number) {
    return this.http.delete<void>(`${this.flavourUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  updateImage(image: string | null): void {
    this.imageSubject.next(image);
  }

  //POSSO CARICARE UN'IMMAGINE
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    console.log('FormData:', formData);
    return this.http
      .post<string>(`${this.flavourUrl}/upload`, formData, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error("Errore nel caricamento dell'immagine:", error); // Mostra dettagli dell'errore
          return throwError(
            () => new Error("Errore nel caricamento dell'immagine")
          ); // Rilancia l'errore affinché possa essere gestito
        })
      );
  }
}
