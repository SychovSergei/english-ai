import { NgModule } from '@angular/core';

import { API_WORDS_URL } from './services/api-url.token';
import { WORD_SERVICE_TOKEN } from './services/word-service.token';
import { WordService } from './services/word.service';
import { environment } from '../../../environments/environment';
import { API_DOMAIN } from '../../core/tokens/api-tokens';

@NgModule({
  imports: [],
  exports: [],
  providers: [
    { provide: API_DOMAIN, useValue: environment.apiDomain },
    { provide: API_WORDS_URL, useValue: '/api/words' },
    { provide: WORD_SERVICE_TOKEN, useClass: WordService },
  ],
})
export class WordsModule {}
