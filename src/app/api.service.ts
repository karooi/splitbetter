import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiKey = 'FJd658XSzT2UW6KvPVy3uJHISZcA6rHmCiDMeEIm';

  constructor(private http: HttpClient) {}

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
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
