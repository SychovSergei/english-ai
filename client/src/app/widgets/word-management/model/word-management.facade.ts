import { WordTableFacade } from '@features/words';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WordManagementFacade {
  constructor(private wordTableFacade: WordTableFacade) {}
}
