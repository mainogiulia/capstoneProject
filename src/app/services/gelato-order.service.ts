import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iGelatoOrder } from '../interfaces/i-gelato-order';

@Injectable({
  providedIn: 'root',
})
export class GelatoOrderService {
  // private gelatoOrderUrl = 'http://localhost:8080/order';
  // constructor(private http: HttpClient) { }
  // createOrder(gelatoOrderRequest: iGelatoOrder): Observable<iGelatoOrder> {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   return this.http.post<iGelatoOrder>(`${this.gelatoOrderUrl}`, gelatoOrderRequest, { headers });
  // }
}
