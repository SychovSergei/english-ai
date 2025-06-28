import { ToolbarComponent } from '@features/user/ui';
import { AuthRoutingModule } from '@pages/auth/auth-routing.module';
import { FooterComponent } from '@shared/ui/footer/footer.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthLayoutComponent } from '../../layouts';

@NgModule({
  imports: [CommonModule, RouterOutlet, AuthRoutingModule, AuthLayoutComponent, FooterComponent, ToolbarComponent],
  declarations: [],
  exports: [AuthLayoutComponent],
  providers: [],
})
export class AuthModule {}
