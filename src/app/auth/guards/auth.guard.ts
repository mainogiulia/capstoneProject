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
        //mi interfaccio con isLoggedIn$ che contiene un observable attraverso il quale transitano dati boolean

        if (!isLoggedIn) {
          this.router.navigate(['/auth/login']);
        }

        return isLoggedIn; //true se l'utente è loggato, false se non lo è.
        //false butta fuori l'utente dalle rote protette da questa guard
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
