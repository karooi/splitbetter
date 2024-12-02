import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiKey = '968STYA948sCJsvkihh2RTDpN3E3SqieE0Vod5Pd';

  constructor(private http: HttpClient) {}

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    localStorage.setItem('apiKey', apiKey);
  }

  getApiKey(): string {
    return this.apiKey;
  }

  initApiKey() {
    this.apiKey = localStorage.getItem('apiKey') ?? '';
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${this.apiKey}`,
    });
  }

  getJsonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }

  get<T>(
    url: string,
    headers?: HttpHeaders,
    params?: HttpParams
  ): Observable<T> {
    return this.http
      .get<T>(url, { headers, params })
      .pipe(catchError(this.handleError));
  }

  post<T>(url: string, body: any, headers: HttpHeaders): Observable<T> {
    return this.http
      .post<T>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  put<T>(url: string, body: any, headers: HttpHeaders): Observable<T> {
    return this.http
      .put<T>(url, body, { headers })
      .pipe(catchError(this.handleError));
  }

  delete<T>(url: string, headers: HttpHeaders): Observable<T> {
    return this.http
      .delete<T>(url, { headers })
      .pipe(catchError(this.handleError));
  }
}
