import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { tap, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      switchMap(authenticated => {
        if (authenticated) {
          // If authenticated, return observable of true
          return of(true);
        } else {
          // If not authenticated, attempt token refresh
          return from(this.authService.refreshToken()).pipe(
            switchMap(() => {
              // If refresh successful, return observable of true
              return of(true);
            }),
            catchError(() => {
              // If refresh fails, navigate to login page and return observable of false
              this.router.navigate(['/login']);
              return of(false);
            })
          );
        }
      }),
      catchError(error => {
        // Handle errors such as network issues or server errors
        console.error('Error in canActivate:', error);
        this.router.navigate(['/login']);
        return of(false); // Return observable of false if an error occurs
      })
    );
  }
}
