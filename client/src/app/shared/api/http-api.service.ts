import { API_DOMAIN } from '@shared/config/api-tokens';
import { LoggerService } from '@shared/lib/logger/logger.service';

import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpApiService {
  private readonly logger = inject(LoggerService).createLogger('HttpApiService');

  constructor(
    @Inject(API_DOMAIN) private apiDomain: string,
    private http: HttpClient,
  ) {}

  get<T>(
    endpoint: string,
    params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[] },
  ): Observable<T> {
    const options = params
      ? { params: params instanceof HttpParams ? params : new HttpParams({ fromObject: params }) }
      : {};
    return this.http.get<T>(`${this.apiDomain}/${endpoint}`, options).pipe(catchError(this.handleError));
    //retry(2), // Повторить запрос в случае ошибки (2 раза)
  }

  post<TResponse, Body = unknown>(endpoint: string, body: Body): Observable<TResponse> {
    this.logger.log(`post  url: ${this.apiDomain}/${endpoint}`);
    return this.http.post<TResponse>(`${this.apiDomain}/${endpoint}`, body).pipe(catchError(this.handleError));
  }

  put<TResponse, Body>(endpoint: string, body: Body): Observable<TResponse> {
    return this.http.put<TResponse>(`${this.apiDomain}/${endpoint}`, body); //.pipe(catchError(this.handleError));
  }

  patch<T, Body>(endpoint: string, body: Body): Observable<T> {
    return this.http.patch<T>(`${this.apiDomain}/${endpoint}`, body).pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiDomain}/${endpoint}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.logger.error('HTTP Error:', error);
    return throwError(() => new Error('Something went wrong, please try again later.'));
  }
}
