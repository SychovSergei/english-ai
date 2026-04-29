import { UserDto, UserSettingsDto } from '@entities/user';
import { HttpApiService } from '@shared/api';

import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly httpService = inject(HttpApiService);
  private readonly API_URL = 'api/users';

  updateSettings(settings: UserSettingsDto): Observable<UserSettingsDto> {
    return this.httpService.put<UserSettingsDto, UserSettingsDto>(`${this.API_URL}/settings`, settings);
  }

  getProfile(): Observable<UserDto> {
    return this.httpService.get<UserDto>(`${this.API_URL}/profile`);
  }

  /**loadConfig(): Observable<UserSettings | null> {
    console.log('>>> UserSettingsService loadSettings');
    return this.httpService.get<UserSettings>(`${this.API_URL}`).pipe(
      tap((config) => {
        this.settingsSubject.next(config);
      }),
      catchError((error) => {
        this.logger.error('Failed to load config:', error);
        this.logger.log('Must show empty page or some another page');
        return of(null); // Возврат пустых настроек, чтобы приложение продолжило работать
      }),
    );
  }*/

  /**updateConfig(newConfig: UpdateUserSettingsData): Observable<UpdateUserSettingsData> {
    return this.httpService
      .put<UpdateUserSettingsData>(`${this.API_URL}`, newConfig)
      .pipe(tap((updatedSettings: UpdateUserSettingsData) => this.settingsSubject.next(updatedSettings)));
  }*/

  /**get currentSettings(): UpdateUserSettingsData | null {
    return this.settingsSubject.value;
  }*/

  /**get loadSettings(): Observable<UserSettings | null> {
    return this.tokenService.getUserDataFromToken().pipe(
      map((user) => user?.settings as unknown as UserSettings),
      tap((setting) => {
        this.settingsSubject.next(setting);
      }),
    );
  }*/

  /**isDefaultLanguage(lang: string): boolean {
    return this.currentSettings?.defaultLanguage === lang;
  }*/
}
