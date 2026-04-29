import { authInitialiseInterceptor, refreshInterceptor, SessionFacade } from '@entities/session';
import { WordSyncService } from '@entities/word';
import { environment } from '@environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NotificationService } from '@shared/api';
import { errorInterceptor } from '@shared/api/error.interceptor';
import { API_DOMAIN } from '@shared/config/api-tokens';
import { AuthStatusProvider } from '@shared/lib/auth/auth-status.provider';
import { NOTIFICATION_SERVICE_TOKEN } from '@shared/lib/tokens/notification-service.token';

import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

// const initTranslations = (i18nService: I18nService): (() => Observable<TranslationRecord>) => {
//   console.log('APP_INITIALIZER initTranslations fetchTranslations');
//   return () => i18nService.fetchTranslations('ua').pipe(take(1));
// };

/**
 * Фабричная функция для инициализации сессии.
 * Angular будет ждать завершения этого промиса.
 */
function initializeAppFactory(sessionFacade: SessionFacade): () => Promise<void> {
  return () => sessionFacade.initializeSession();
}
/**
 * Фабричная функция для инициализации синхронных сервисов.
 * Гарантия того, что все сервисы будут готовы к работе
 */
function initializeSyncServicesFactory(wordSync: WordSyncService): () => Promise<void> {
  wordSync.sync();
  return () => Promise.resolve();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(/*SharedModule, WordsModule, WordSetsModule*/),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        authInitialiseInterceptor, // 1.Добавил токен в заголовки
        refreshInterceptor, // 2.Если 401, то Обновление токена и повторная отправка запроса
        errorInterceptor, // 3.Если всё еще ошибка — показал SnackBar через CustomHttpErrorResponse
      ]),
      withFetch(), // Рекомендуется для новых версий Angular
    ),
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ]),
    { provide: API_DOMAIN, useValue: environment.apiDomain },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [SessionFacade],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeSyncServicesFactory,
      deps: [WordSyncService],
      multi: true,
    },

    // Связываем абстракцию из Shared с реализацией из Entities
    {
      provide: AuthStatusProvider,
      useExisting: SessionFacade,
    },
    {
      provide: NOTIFICATION_SERVICE_TOKEN,
      useClass: NotificationService,
    },
  ],
};
