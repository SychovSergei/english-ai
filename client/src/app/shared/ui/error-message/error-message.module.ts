import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ErrorMessageComponent } from './error-message.component';

@NgModule({
  imports: [CommonModule],
  exports: [ErrorMessageComponent],
  declarations: [ErrorMessageComponent],
})
export class ErrorMessageModule {}
