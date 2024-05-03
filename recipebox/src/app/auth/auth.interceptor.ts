import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // does not need auth
    if (request.headers.has('no-auth')) {
      request = request.clone({
        // remove no-auth from header
        headers: request.headers.delete('no-auth'),
      });
      return next.handle(request);
    } else {
      // requires auth
      // attach access token to request headers
      return from(this.authService.getAccessToken()).pipe(
        switchMap(accessToken => {
          if (accessToken) {
            request = this.addToken(request, accessToken);
            return next.handle(request).pipe(
              catchError((error: HttpErrorResponse) => {
                if (error.status === 401 && !request.url.includes('/auth/refresh/')) {
                  return this.handle401Error(request, next);
                } else {
                  return throwError(() => error);
                }
              })
            );
          } else {
            // If access token is null, throw an error
            return throwError(() => 'Access token is null.');
          }
        })
      );
    }
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.refreshToken()).pipe(
      switchMap(() => {
        return from(this.authService.getAccessToken()).pipe(
          switchMap((newAccessToken: string | null) => {
            if (newAccessToken) {
              request = this.addToken(request, newAccessToken);
              return next.handle(request);
            } else {
              // If new access token is still not available, throw an error
              return throwError(() => 'Access token is still not available after refreshing.');
            }
          })
        );
      }),
      catchError(error => {
        // Handle refresh token errors
        console.error('Error refreshing token:', error);
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'authorization': `Bearer ${token}`,
      }
    });
  }
}
