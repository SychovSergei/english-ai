import { CoreModule } from '@core/core.module';
import { authInterceptor, errorInterceptor } from '@core/interceptors';
import { CORE_PROVIDERS } from '@core/providers/core.providers';
import { WordSetsModule } from '@features/word-set/word-sets.module';
import { WordsModule } from '@features/words/words.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

// const initTranslations = (i18nService: I18nService): (() => Observable<TranslationRecord>) => {
//   console.log('APP_INITIALIZER initTranslations fetchTranslations');
//   return () => i18nService.fetchTranslations('ua').pipe(take(1));
// };

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(CoreModule, WordsModule, WordSetsModule),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ]),
    ...CORE_PROVIDERS,
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
