import { NgModule } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { TableActionsComponent } from './table-actions.component';

@NgModule({
  imports: [MatButton, MatIcon],
  exports: [TableActionsComponent],
  declarations: [TableActionsComponent],
})
export class TableActionsModule {}
