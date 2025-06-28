import { CreateWordSetComponent } from '@pages/word-sets/create-word-set/ui/create-word-set.component';
import { WordSetsPage } from '@pages/word-sets/word-sets.page';

import { NgModule } from '@angular/core';

@NgModule({
  imports: [CreateWordSetComponent],
  declarations: [WordSetsPage],
  exports: [WordSetsPage],
  providers: [],
})
export class WordSetsPageModule {}
