// import { NgModule } from '@angular/core';
//
// import { API_WORDS_URL } from './services/api-url.token';
// import { WORD_SERVICE_TOKEN } from './services/word-service.token';
// import { WordService } from './services/word.service';
// import { environment } from '../../../environments/environment';
// import { API_DOMAIN } from '../../core/tokens/api-tokens';
//
// @NgModule({
//   imports: [],
//   exports: [],
//   providers: [
//     { provide: API_DOMAIN, useValue: environment.apiDomain },
//     { provide: API_WORDS_URL, useValue: '/api/words' },
//     { provide: WORD_SERVICE_TOKEN, useClass: WordService },
//   ],
// })
// export class WordsModule {}

import { WordService } from '@entities/word';
import { WORD_SERVICE_TOKEN } from '@features/words/model/word.tokens';
// import { API_MODULE_URL } from '@shared/config/api-tokens';
import { NotificationService } from '@shared/services/notification/notification.service';
import { NOTIFICATION_SERVICE_TOKEN } from '@shared/services/notification/notification-service.token';

import { NgModule } from '@angular/core';

@NgModule({
  imports: [],
  exports: [],
  providers: [
    // { provide: API_MODULE_URL, useValue: 'api/words' },
    { provide: WORD_SERVICE_TOKEN, useClass: WordService },
    { provide: NOTIFICATION_SERVICE_TOKEN, useClass: NotificationService },
  ],
})
export class WordsModule {}
