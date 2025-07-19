// import { TableActionsModule } from '@features/table-actions';
// import { WordTableActionsComponent, WordTableComponent } from '@features/words';

import { WordService } from '@entities/word';
import { WORD_SERVICE_TOKEN } from '@features/words/model/word.tokens';
import { NotificationService } from '@shared/services/notification/notification.service';
import { NOTIFICATION_SERVICE_TOKEN } from '@shared/services/notification/notification-service.token';
// import { TableWidgetModule } from '@widgets/table-widget';
import { WordManagementComponent } from '@widgets/word-management/ui/word-management.component';

import { NgModule } from '@angular/core';

// import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { WordsPage } from './words.page';

@NgModule({
  imports: [
    // TableWidgetModule,
    // TableActionsModule,
    // MatCard,
    // MatCardContent,
    // MatCardHeader,
    // WordTableComponent,
    // WordTableActionsComponent,
    WordManagementComponent,
  ],
  declarations: [WordsPage],
  exports: [WordsPage],
  providers: [
    // { provide: API_DOMAIN, useValue: environment.apiDomain },
    // { provide: API_WORDS_URL, useValue: 'api/words' },
    { provide: WORD_SERVICE_TOKEN, useClass: WordService },
    { provide: NOTIFICATION_SERVICE_TOKEN, useClass: NotificationService },
  ],
})
export class WordsPageModule {}
