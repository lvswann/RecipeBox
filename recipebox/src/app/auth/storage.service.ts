import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {
    this.initStorage();
  }

  private async initStorage(): Promise<void> {
    try {
      // Initialize Ionic Storage
      await this.storage.create();
      console.log('Storage initialized successfully.');
    } catch (error) {
      // Handle initialization errors
      console.error('Error initializing storage:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  }

  public set(key: string, value: any): Observable<void> {
    return from(this.storage.set(key, value)).pipe(
      catchError(error => {
        // Handle set operation errors
        console.error(`Error setting item with key '${key}':`, error);
        return throwError(() => error); // Rethrow the error for the caller to handle
      })
    );
  }

  public get(key: string): Observable<any> {
    return from(this.storage.get(key)).pipe(
      catchError(error => {
        // Handle get operation errors
        console.error(`Error getting item with key '${key}':`, error);
        return throwError(() => error); // Rethrow the error for the caller to handle
      })
    );
  }

  public remove(key: string): Observable<void> {
    return from(this.storage.remove(key)).pipe(
      catchError(error => {
        // Handle remove operation errors
        console.error(`Error removing item with key '${key}':`, error);
        return throwError(() => error); // Rethrow the error for the caller to handle
      })
    );
  }
}
