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
