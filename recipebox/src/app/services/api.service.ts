import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api_url = environment.api_url;

  private httpHeaderAuth = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
  ) {}


  // Recipe and Section API Calls
  get_all<T>(type: string, param: string = ''): Observable<T> {
    return this.http.get<T>(`${this.api_url}/${type}/${param}`, this.httpHeaderAuth);
  }

  get_with_id<T>(type: string, id: string): Observable<T> {
    return this.http.get<T>(`${this.api_url}/${type}/${id}/`, this.httpHeaderAuth);
  }

  put_with_id<T>(type: string, id: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.api_url}/${type}/${id}/`, data, this.httpHeaderAuth);
  }

  delete_with_id<T>(type: string, id: string): Observable<T> {
    return this.http.delete<T>(`${this.api_url}/${type}/${id}/`, this.httpHeaderAuth);
  }

  post<T>(type:string, data: any): Observable<T> {
    return this.http.post<T>(`${this.api_url}/${type}/`, data, this.httpHeaderAuth);
  }

  // User API



}
