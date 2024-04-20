import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
  ) {}

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
            request = request.clone({
              setHeaders: {
                'authorization': `Bearer ${accessToken}`,
              }
            });
          }
          return next.handle(request);
        })
      );
    }
  }
}
