import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

// should go back to using CanActivateFn since CanActivate is deprecated

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      tap(authenticated => {
        if (!authenticated) {
          // If not authenticated, navigate to the login page
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
