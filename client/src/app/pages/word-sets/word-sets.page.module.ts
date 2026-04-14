import { CreateWordSetComponent, WordSetsPage } from '@pages/word-sets';

import { NgModule } from '@angular/core';

@NgModule({
  imports: [CreateWordSetComponent],
  declarations: [WordSetsPage],
  exports: [WordSetsPage],
  providers: [],
})
export class WordSetsPageModule {}
