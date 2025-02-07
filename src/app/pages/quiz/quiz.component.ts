import { Component, OnInit } from '@angular/core';
import { iQuestion } from '../../interfaces/i-question';
import { iDrink } from '../../interfaces/i-drink';
import { QuizService } from '../../services/quiz.service';
import { iAnswer } from '../../interfaces/i-answer';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
})
export class QuizComponent implements OnInit {
  question!: iQuestion | null; //ALLA FINE DEL QUIZ question E' NULL
  drink!: iDrink | null; //QUANDO PARTE startQuiz(), drink E' NULL E VIENE RESETTATO OGNI VOLTA

  constructor(private quizSvc: QuizService) {}

  ngOnInit(): void {
    this.startQuiz();
  }

  //INIZIA IL QUIZ E RESTITUISCE LA RPIMA DOMANDA
  startQuiz() {
    this.quizSvc.startQuiz().subscribe((data) => {
      //data E' UN OGGETTO DI TIPO iQuestion
      this.question = data;
      this.drink = null;
    });
  }

  //SELEZIONA LA RISPOSTA E RESTITUISCE O LA PROSSIMA DOMANDA O IL DRINK
  selectAnswer(answer: iAnswer) {
    this.quizSvc.nextStep(answer.id).subscribe((response) => {
      //response PUO' ESSERE iQuestion OPPURE iDrink
      if ('answers' in response) {
        //SE 'answers' E' PRESENTE NELLA RISPOSTA ALLORA VUOL DIRE CHE IL BACKEND HA RESTITUITO UNA DOMANDA
        this.question = response as iQuestion; //CONVERTE response IN UN OGGETTO DI TIPO iQuestion E AGGIORNA LA VARIABILE question CON LA NUOVA DOMANDA
        this.drink = null;
      } else {
        this.drink = response as iDrink;
        this.question = null;
      }
    });
  }
}
