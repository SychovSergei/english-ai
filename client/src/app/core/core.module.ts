import { environment } from '@environments/environment';
import { WordsPageModule } from '@pages/words';
import { API_DOMAIN } from '@shared/config/api-tokens';
import { SharedModule } from '@shared/shared.module';

import { NgModule } from '@angular/core';

NgModule({
  imports: [SharedModule, WordsPageModule],
  exports: [],
  declarations: [],
  providers: [{ provide: API_DOMAIN, useValue: environment.apiDomain }],
});
export class CoreModule {}
