import { NgModule } from '@angular/core';

import { API_DOMAIN } from './tokens/api-tokens';
import { environment } from '../../environments/environment';

NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [{ provide: API_DOMAIN, useValue: environment.apiDomain }],
});
export class CoreModule {}
