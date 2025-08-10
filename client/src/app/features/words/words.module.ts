// import { WORD_SERVICE_TOKEN } from '@features/words';
// import { WordService } from '@features/words';
// import { API_MODULE_URL } from '@shared/config/api-tokens';
import { NotificationService } from '@shared/services/notification/notification.service';
import { NOTIFICATION_SERVICE_TOKEN } from '@shared/services/notification/notification-service.token';

import { NgModule } from '@angular/core';
// import { WordService } from '@features/words/word.service';
// import { WORD_SERVICE_TOKEN } from '@features/words/word-service.token';

@NgModule({
  imports: [],
  exports: [],
  providers: [
    // { provide: API_MODULE_URL, useValue: 'api/words' },
    // { provide: WORD_SERVICE_TOKEN, useClass: WordService },
    { provide: NOTIFICATION_SERVICE_TOKEN, useClass: NotificationService },
  ],
})
export class WordsModule {}
