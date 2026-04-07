import { TokenService } from '@entities/session/api';
import { UpdateUserSettingsData, UserSettings } from '@entities/user';
import { environment } from '@environments/environment';
import { LoggerService } from '@shared/lib/logger/logger.service';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  // TODO переименовать в UserApiService
  //  только для запросов на сервер, остальные методы и свойства выделить отдельно
  private readonly loggerService = inject(LoggerService).createLogger('UserSettingsService');
  private readonly apiDomain = environment.apiDomain;
  private readonly apiUrl = 'api/user-settings';

  private settingsSubject = new BehaviorSubject<UpdateUserSettingsData | null>(null);
  settings$ = this.settingsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {}

  loadConfig(): Observable<UserSettings | null> {
    console.log('>>> UserSettingsService loadSettings');
    return this.http.get<UserSettings>(`${this.apiDomain}${this.apiUrl}`).pipe(
      tap((config) => {
        this.settingsSubject.next(config);
      }),
      catchError((error) => {
        this.loggerService.error('Failed to load config:', error);
        this.loggerService.log('Must show empty page or some another page');
        return of(null); // Возврат пустых настроек, чтобы приложение продолжило работать
      }),
    );
  }

  updateConfig(newConfig: UpdateUserSettingsData): Observable<UpdateUserSettingsData> {
    return this.http
      .put<UpdateUserSettingsData>(`${this.apiDomain}${this.apiUrl}`, newConfig)
      .pipe(tap((updatedSettings: UpdateUserSettingsData) => this.settingsSubject.next(updatedSettings)));
  }

  get currentSettings(): UpdateUserSettingsData | null {
    return this.settingsSubject.value;
  }

  get loadSettings(): Observable<UserSettings | null> {
    return this.tokenService.getUserDataFromToken().pipe(
      map((user) => user?.settings as unknown as UserSettings),
      tap((setting) => {
        this.settingsSubject.next(setting);
      }),
    );
  }

  isDefaultLanguage(lang: string): boolean {
    return this.currentSettings?.defaultLanguage === lang;
  }
}
