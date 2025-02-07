import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ChiSiamoComponent } from './pages/chi-siamo/chi-siamo.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { GelatoOrderComponent } from './pages/gelato-order/gelato-order.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'chi-siamo', component: ChiSiamoComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'gelato-order', component: GelatoOrderComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
