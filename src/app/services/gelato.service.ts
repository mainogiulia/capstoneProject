import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { iFlavour } from '../interfaces/i-flavour';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GelatoService {
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
  createFlavour(newFlavour: Partial<iFlavour>) {
    return this.http.post<iFlavour>(this.flavourUrl, newFlavour, {
      headers: this.getHeaders(),
    });
  }

  //MODIFICO UN GUSTO (ADMIN)
  editFlavour(id: number, flavour: iFlavour) {
    return this.http.put<iFlavour>(`${this.flavourUrl}/${id}`, flavour, {
      headers: this.getHeaders(),
    });
  }

  //ELIMINAZIONE GUSTO (ADMIN)
  deleteFlavour(id: number) {
    return this.http.delete<void>(`${this.flavourUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
