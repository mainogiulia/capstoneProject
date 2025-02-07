import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ChiSiamoComponent } from './pages/chi-siamo/chi-siamo.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { GelatoOrderComponent } from './pages/gelato-order/gelato-order.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { GuestGuard } from './auth/guards/guest.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'chi-siamo', component: ChiSiamoComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'reservation', component: ReservationComponent },
  {
    path: 'gelato-order',
    component: GelatoOrderComponent,
    canActivate: [GuestGuard],
    canActivateChild: [GuestGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [GuestGuard],
    canActivateChild: [GuestGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
