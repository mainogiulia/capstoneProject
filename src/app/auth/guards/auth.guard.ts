import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  //GUARD PER PROTEGGERE LE ROTTE SE UTENTE NON E' LOGGATO
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    return this.authSvc.isLoggedIn$.pipe(
      map((isLoggedIn) => {
        //MI INTERFACCIO CON isLoggedIn$ CHE CONTIENE UN OBSERVABLE ATTRAVERSO IL QUALE TRANSITANO DATI BOOLEANI

        if (!isLoggedIn) {
          this.router.navigate(['/auth/login']);
        }

        return isLoggedIn; // false BUTTA FUORI L'UTENTE DEALLE ROTTE PROTETTE DA QUESTA GUARD
      })
    );
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    return this.canActivate(childRoute, state);
  }
}
