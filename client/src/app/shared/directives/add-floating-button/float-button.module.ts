import { UiKitModule } from '@shared/ui/ui-kit';

import { NgIf } from '@angular/common';
import { NgModule } from '@angular/core';

import { FloatingButtonDirective } from './model';
import { FloatButtonComponent } from './ui';

@NgModule({
  imports: [NgIf, UiKitModule],
  exports: [FloatButtonComponent, FloatingButtonDirective],
  declarations: [FloatButtonComponent, FloatingButtonDirective],
})
export class FloatButtonModule {}
