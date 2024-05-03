import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, from, of, throwError, firstValueFrom, take, lastValueFrom, timer } from "rxjs";
import { map, tap, catchError, switchMap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from "src/environments/environment";
import { User } from '../interfaces';

@Injectable({
  providedIn: "root",
})

export class AuthService {
  private api_url = environment.api_url

  // JwtHelperService instance for decoding JWT tokens
  private jwtHelper: JwtHelperService = new JwtHelperService();

  private httpHeaderAuth = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    }),
  };

  private httpHeaderNoAuth = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'no-auth': 'true',
    }),
  };

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private cookieService: CookieService,
    private _router: Router
  ) {}

  public getAccessToken(): Observable<string | null> {
    return this.storageService.get('access_token');
  }

  public isAuthenticated(): Observable<boolean> {
    return this.getAccessToken().pipe(
      map((accessToken) => !!accessToken && !this.jwtHelper.isTokenExpired(accessToken))
    );
  }

  public isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  public async login(credentials:any): Promise<any> {
    try {
      const response = await lastValueFrom(this.http.post<any>(`${this.api_url}/auth/login/`, credentials, this.httpHeaderNoAuth));
      this.storeTokens(response.access_token, response.refresh_token);

      // Wait for a short period before checking the access token again
      await lastValueFrom(timer(500).pipe(take(1)));

      // Check if the access token is not null
      const accessToken = await lastValueFrom(this.getAccessToken());
      if (accessToken !== null) {
        this._router.navigate(['/home']);
      } else {
        throw new Error('Access token is null');
      }


    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  public async register(userData: any): Promise<any> {
    try {
      await lastValueFrom(this.http.post<any>(`${this.api_url}/users/`, userData, this.httpHeaderNoAuth));
      await this.login(userData);
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }


  public async refreshToken(): Promise<void> {
    try {

      // check if there is an access token, otherwise user has already logged out
      const accessToken = await lastValueFrom(this.getAccessToken());
      if (!accessToken) {
        console.log('No access token available. Skipping refresh token request.');
        this.clearTokens();
        this._router.navigate(['/login']);

        return;
      }

      const refreshToken = this.cookieService.get('refresh_token');
      const response = await lastValueFrom(this.http.post<any>(`${this.api_url}/auth/refresh/`, { refresh_token: refreshToken }, this.httpHeaderNoAuth));
      if (response && response.access_token) {
        this.storageService.set('access_token', response.access_token);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }


  public async logout(): Promise<void> {
    try {
      const refreshToken = this.cookieService.get('refresh_token');
      if (!refreshToken) {
        // If refresh token is not available, clear tokens and return Observable of null
        console.log('No refresh token found. Clearing tokens.');

        this.clearTokens();
      }

      await lastValueFrom(this.http.post<any>(`${this.api_url}/auth/logout/`, { refresh_token: refreshToken }, this.httpHeaderAuth));

      // Wait for a short period before clearing tokens
      await lastValueFrom(timer(500).pipe(take(1)));

      this.clearTokens();
      this._router.navigate(['/login']);

    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }


  private storeTokens(accessToken: string, refreshToken: string): void {
    console.log('Storing tokens:', { accessToken, refreshToken });
    this.storageService.set('access_token', accessToken);
    this.cookieService.set('refresh_token', refreshToken, undefined, '/', undefined, true, 'Strict');
  }

  private clearTokens(): void {
    console.log('Clearing tokens.');
    this.storageService.remove('access_token');
    this.cookieService.delete('refresh_token', '/', undefined, true, 'Strict');
  }

}
