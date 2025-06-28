import { IUser } from '@entities/user';
import { HttpApiService } from '@shared/api';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserApi {
  private readonly apiUrl = '/api/user';

  constructor(private http: HttpApiService) {}

  getUserInfo(): Observable<IUser> {
    return this.http.get<IUser>(this.apiUrl);
  }

  // здесь можно будет добавить методы updateUser(), createUser() и т.д.
}
