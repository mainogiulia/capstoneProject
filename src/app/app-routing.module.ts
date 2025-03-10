import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { GuestGuard } from './auth/guards/guest.guard';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { GelatoComponent } from './pages/gelato/gelato.component';
import { RegisterComponent } from './auth/register/register.component';
import { NewFlavourComponent } from './pages/new-flavour/new-flavour.component';
import { EditFlavourComponent } from './pages/edit-flavour/edit-flavour.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'gelato-order', component: GelatoComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [GuestGuard],
    canActivateChild: [GuestGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [GuestGuard],
    canActivateChild: [GuestGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  { path: 'success', component: PaymentSuccessComponent },
  {
    path: 'new-flavour',
    component: NewFlavourComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: 'edit-flavour/:id',
    component: EditFlavourComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
