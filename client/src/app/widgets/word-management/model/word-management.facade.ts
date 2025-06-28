import { WordTableFacade } from '@features/words/model/word-table.facade';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WordManagementFacade {
  constructor(private wordTableFacade: WordTableFacade) {}
}
