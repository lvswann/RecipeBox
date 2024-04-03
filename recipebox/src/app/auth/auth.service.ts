import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, from, of, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: "root",
})

export class AuthService {
  // used to store the decrypted user information from the access token
  private userInfoSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  // observable for components to subscribe to user information changes
  public userInfo$: Observable<any> = this.userInfoSubject.asObservable();

  // JwtHelperService instance for decoding JWT tokens
  private jwtHelper: JwtHelperService = new JwtHelperService();


  constructor(
    private storage: Storage,
    private http: HttpClient,
  ) {
    this.loadUserInfo();
  }



  private async loadUserInfo(): Promise<void> {
    console.log('Loading user info...');
    await this.storage.create(); // Ensure that Storage database is created

    this.getAccessToken().subscribe(token => {
      console.log('Token:', token); // Log the retrieved token
      if (token) {
        const decodedUser = this.jwtHelper.decodeToken(token);
        console.log('Decoded User:', decodedUser); // Log the decoded user information
        this.userInfoSubject.next(decodedUser);
      }
    });
  }

  public getAccessToken(): Observable<string | null> {
    console.log('getAcessToken: ', from(this.storage.get("access_token")));
    return from(this.storage.get("access_token"));
  }

  public async isStorageEmpty(): Promise<boolean> {
    const accessToken = await this.storage.get('access_token');
    return !accessToken; // Returns true if accessToken is null or undefined
  }


  public registerUser(userData: any): Observable<any> {
    console.log('Im in auth.service.ts registerUser function');
    this.storage.remove('access_token');

    this.isStorageEmpty().then(isEmpty => {
      console.log('isStorageEmpty: ', isEmpty);
    });

    return this.http.post<any>('http://127.0.0.1:5000/users/', userData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }


  public loginUser(credentials: any): Observable<any> {
    console.log('Im in auth.service.ts loginUser function');

    return this.http.post<any>('http://127.0.0.1:5000/auth/login/', credentials).pipe(
      map(response => {
        console.log('Token:', response.access_token);
        if (response && response.access_token) {
          console.log('In response && response.access_token');
          console.log("this is access_token new: ", response.access_token);

          // Store the access token
          this.storage.set('access_token', response.access_token).then(() => {
            console.log('Token stored successfully:', response.access_token);

            // Retrieve the stored token and log it
            this.storage.get('access_token').then((storedToken) => {
              console.log('Retrieved token from storage:', storedToken);
            }).catch(error => {
              console.error('Error retrieving stored token:', error);
            });
          }).catch(error => {
            console.error('Error storing token:', error);
          });

          const decodedUser = this.jwtHelper.decodeToken(response.access_token);
          this.userInfoSubject.next(decodedUser);
        }
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }


 // Refresh access token
  public refreshToken(): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:5000/auth/refresh/', {}).pipe(
      map(response => {
        console.log('Refreshed Token:', response.access_token);
        if (response && response.access_token) {
          console.log('In response && response.access_token');
          console.log("this is refreshed_access_token: ", response.access_token);

          // Store the refreshed access token
          this.storage.set('access_token', response.access_token).then(() => {
            console.log('Refreshed token stored successfully:', response.access_token);

            // Retrieve the stored token and log it
            this.storage.get('access_token').then((storedToken) => {
              console.log('Retrieved refreshed token from storage:', storedToken);
              const decodedUser = this.jwtHelper.decodeToken(storedToken);
              this.userInfoSubject.next(decodedUser);
            }).catch(error => {
              console.error('Error retrieving stored token:', error);
            });
          }).catch(error => {
            console.error('Error storing refreshed token:', error);
          });

        }
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }


  // Logout user and remove access token
  public logout(): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:5000/auth/logout/', {}).pipe(
      map(() => {
        this.storage.remove('access_token');
        this.userInfoSubject.next(null);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

}
