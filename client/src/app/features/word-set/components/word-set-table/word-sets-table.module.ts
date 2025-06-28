import { WordSetsTableComponent } from '@features/word-set/components/word-set-table/word-sets-table.component';
import { DataTableComponent } from 'app/shared/ui/data-table';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
// import { WORD_SERVICE_TOKEN } from '@entities/word/consts/word-service.token';
// import { WordService } from '@entities/word/services/word.service';

@NgModule({
  imports: [CommonModule, DataTableComponent, MatButton, MatIcon, MatIconButton, MatMenuTrigger, MatMenu, MatMenuItem],
  declarations: [WordSetsTableComponent],
  exports: [WordSetsTableComponent],
  providers: [
    // { provide: API_DOMAIN, useValue: environment.apiDomain },
    // { provide: API_WORDS_URL, useValue: 'api/word-sets' }, //TODO from entity or feature????
    // { provide: WORD_SERVICE_TOKEN, useClass: WordService },
  ],
})
export class WordSetsTableModule {
  // TODO может быть это widget ???
}
