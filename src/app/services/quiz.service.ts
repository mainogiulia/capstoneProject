import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { iQuestion } from '../interfaces/i-question';
import { iDrink } from '../interfaces/i-drink';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private quizUrl = 'http://localhost:8080/quiz'; // URL del backend

  constructor(private http: HttpClient) {}

  //INIZIA IL QUIZ E RESTITUISCE LA PRIMA DOMANDA
  startQuiz(): Observable<iQuestion> {
    return this.http.get<iQuestion>(`${this.quizUrl}/start`);
  }

  //RESTITUISCE IL PROSSIMO STEP IN BASE ALLA RISPOSTA SELEZIONATA
  nextStep(answerId: number): Observable<iQuestion | iDrink> {
    return this.http.get<iQuestion | iDrink>(
      `${this.quizUrl}/next/${answerId}`
    );
  }
}
