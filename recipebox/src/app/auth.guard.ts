import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from "./auth/auth.service";
import { take, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

// If the 'checkUserObs' observable value returns true means
// the user is logged-in, in that case, if the user tries to
// access the 'login' URL then we redirect to the home
// route. If the 'chekUserObs' returns value false then the
// user can only see a login page.


class PermissionsService {

  constructor(
    private authService: AuthService,
    private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree {
    return this.authService.userInfo$.pipe(
      take(1),
      map((user) => {
        if (!user) {
          if (state.url.indexOf("login") != -1) {
            return true;
          } else {
            this.router.navigateByUrl("/login");
            return false;
          }
        } else {
          if(state.url.indexOf("login") != -1){
            this.router.navigateByUrl("/home");
            return false;
          }else{
             return true;
          }
        }
      })
    );
  }
}


export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
| Observable<boolean | UrlTree>
| Promise<boolean | UrlTree>
| boolean
| UrlTree => {
  return inject(PermissionsService).canActivate(next, state);
}
