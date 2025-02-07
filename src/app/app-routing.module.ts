import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ChiSiamoComponent } from './pages/chi-siamo/chi-siamo.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ReservationComponent } from './pages/reservation/reservation.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'chi-siamo', component: ChiSiamoComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'reservation', component: ReservationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
