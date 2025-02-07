import { iAnswer } from './i-answer';

export interface iQuestion {
  id: number;
  text: string;
  answers: iAnswer[];
}
