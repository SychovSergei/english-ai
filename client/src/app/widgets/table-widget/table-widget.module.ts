import { UiKitModule } from '@shared/ui/ui-kit';

import { NgModule } from '@angular/core';

import { TableWidgetComponent } from './table-widget.component';

@NgModule({
  exports: [TableWidgetComponent],
  declarations: [TableWidgetComponent],
  imports: [UiKitModule],
})
export class TableWidgetModule {}
