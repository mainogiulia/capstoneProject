import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { iFlavour } from '../interfaces/i-flavour';

@Injectable({
  providedIn: 'root',
})
export class GelatoOrderService {
  private apiUrl = 'http://localhost:8080/api/flavour';

  constructor(private http: HttpClient) {}

  getFlavours(): Observable<iFlavour[]> {
    return this.http.get<iFlavour[]>(this.apiUrl);
  }
}
