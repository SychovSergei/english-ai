import { environment } from '@environments/environment';
import { TokenService } from '@shared/infrastructure';
import { UserSettings, UserUpdateSettings } from '@shared/interfaces/user-settings.interface';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  // TODO !!! move to application layer (features)
  private readonly apiDomain = environment.apiDomain;
  private readonly apiUrl = 'api/user-settings';

  private settingsSubject = new BehaviorSubject<UserUpdateSettings | null>(null);
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
        console.error('Failed to load config:', error);
        console.log('Must show empty page or some another page');
        return of(null); // Возврат пустых настроек, чтобы приложение продолжило работать
      }),
    );
  }

  updateConfig(newConfig: UserUpdateSettings): Observable<UserUpdateSettings> {
    return this.http
      .put<UserUpdateSettings>(`${this.apiDomain}${this.apiUrl}`, newConfig)
      .pipe(tap((updatedSettings: UserUpdateSettings) => this.settingsSubject.next(updatedSettings)));
  }

  get currentSettings(): UserUpdateSettings | null {
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
