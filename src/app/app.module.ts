import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { NavbarComponent } from './main-components/navbar/navbar.component';
import { FooterComponent } from './main-components/footer/footer.component';
import { MenuComponent } from './pages/menu/menu.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule } from '@angular/forms';
import { MapComponent } from './main-components/map/map.component';
import { GelatoComponent } from './pages/gelato/gelato.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { PaymentCancelComponent } from './pages/payment-cancel/payment-cancel.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuizComponent,
    NavbarComponent,
    FooterComponent,
    MenuComponent,
    LoginComponent,
    RegisterComponent,
    GelatoComponent,
    MapComponent,
    PaymentSuccessComponent,
    PaymentCancelComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
