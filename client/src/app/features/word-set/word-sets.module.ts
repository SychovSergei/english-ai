import { WordSetService } from '@entities/word-set';
import { WORD_SET_SERVICE_TOKEN } from '@features/word-set/word-set.tokens';

// import { API_MODULE_URL } from '@shared/config/api-tokens';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [],
  exports: [],
  providers: [
    // { provide: API_MODULE_URL, useValue: 'api/word-sets' },
    { provide: WORD_SET_SERVICE_TOKEN, useClass: WordSetService },
    // { provide: NOTIFICATION_SERVICE_TOKEN, useClass: NotificationService },
  ],
})
export class WordSetsModule {}
