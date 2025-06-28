import { TableActionsModule } from '@shared/ui/data-table-actions';

import { NgModule } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { TableWidgetComponent } from './table-widget.component';

@NgModule({
  exports: [TableWidgetComponent],
  declarations: [TableWidgetComponent],
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,

    TableActionsModule,
  ],
})
export class TableWidgetModule {}
