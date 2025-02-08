import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TokenService } from '../../auth/services/token.service';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiDomain = environment.apiDomain;
  private readonly apiUrl = '/api/user';

  private userSubject = new BehaviorSubject<User | null>(null);
  userInfo$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {}

  getUserInfo(): Observable<User | null> {
    //TODO надо доработать (если планируется получение настроек отдельно)
    // TODO обработка ошибок
    console.log('>>> UserService getUserInfo');
    return this.http.get<User>(`${this.apiDomain}${this.apiUrl}`).pipe(
      tap((userInfo) => {
        console.log(userInfo);
        this.userSubject.next(userInfo);
      }),
      catchError((error) => {
        console.error('Failed to load user info:', error);
        console.log('Must show empty page or some another page');
        return of(null); // Возврат пустых настроек, чтобы приложение продолжило работать
      }),
    );
  }

  getCurrentUserInfo() {
    // return this.userSubject.value;
    this.tokenService.getUserDataFromToken().subscribe((user) => {
      this.userSubject.next(user);
    });
  }

  /**
  createUser(data: CreateUserDTO): Observable<User> {
    console.log('DD-AA-TT-AA ', data);
    return this.http.post<CreateWordResponse>(`${this.apiDomain}${this.apiUrl}`, data).pipe();
  }*/
}
