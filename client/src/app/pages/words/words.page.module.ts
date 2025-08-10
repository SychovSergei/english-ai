// import { WordService } from '@features/words';
// import { WORD_SERVICE_TOKEN } from '@features/words';
import { NotificationService } from '@shared/services/notification/notification.service';
import { NOTIFICATION_SERVICE_TOKEN } from '@shared/services/notification/notification-service.token';
import { WordManagementComponent } from '@widgets/word-management/ui/word-management.component';

import { NgModule } from '@angular/core';

// import { WordsPage } from './words.page';

@NgModule({
  imports: [WordManagementComponent],
  declarations: [],
  exports: [],
  providers: [
    // { provide: API_DOMAIN, useValue: environment.apiDomain },
    // { provide: API_WORDS_URL, useValue: 'api/words' },
    // { provide: WORD_SERVICE_TOKEN, useClass: WordService },
    { provide: NOTIFICATION_SERVICE_TOKEN, useClass: NotificationService },
  ],
})
export class WordsPageModule {}
