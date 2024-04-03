import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return this.authService.getAccessToken().pipe(
      switchMap(accessToken => {
        if (accessToken) {
          request = request.clone({
            setHeaders: {
              'authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
          });

        // Log the request payload
        console.log('Request Payload:', request);

        }
        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              // Unauthorized error, possibly due to expired token
              // Attempt to refresh token
              return this.authService.refreshToken().pipe(
                catchError(() => {
                  // Refresh token failed or some other error occurred
                  // Logout user and redirect to login page
                  return this.authService.logout().pipe(
                    switchMap(() => {
                      // Redirect to login page or show error message
                      // Example: this.router.navigate(['/login']);
                      return throwError(() => 'Session expired');
                    })
                  );
                })
              );
            }
            // For other errors, simply pass them along
            return throwError(() => error);
          })
        );
      })
    );
  }
}
