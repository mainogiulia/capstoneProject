import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { NavbarComponent } from './main-components/navbar/navbar.component';
import { FooterComponent } from './main-components/footer/footer.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ChiSiamoComponent } from './pages/chi-siamo/chi-siamo.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule } from '@angular/forms';
import { GelatoOrderComponent } from './pages/gelato-order/gelato-order.component';
import { MapComponent } from './main-components/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuizComponent,
    NavbarComponent,
    FooterComponent,
    ReservationComponent,
    MenuComponent,
    ChiSiamoComponent,
    LoginComponent,
    RegisterComponent,
    GelatoOrderComponent,
    MapComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
