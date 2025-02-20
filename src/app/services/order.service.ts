import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iGelatoOrder } from '../interfaces/i-gelato-order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  orderUrl: string = environment.orderUrl; // URL DEL BACKEND

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessData')
      ? JSON.parse(localStorage.getItem('accessData')!).token
      : null;
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllOrders(): Observable<iGelatoOrder[]> {
    return this.http.get<iGelatoOrder[]>(this.orderUrl, {
      headers: this.getHeaders(),
    });
  }
}
