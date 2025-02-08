import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './services/auth.service';
import { AuthComponent } from '../layout/auth-layout/auth.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';

@NgModule({
  imports: [CommonModule, RouterOutlet, AuthRoutingModule, AuthComponent, FooterComponent, ToolbarComponent],
  declarations: [],
  exports: [AuthComponent],
  providers: [AuthService],
})
export class AuthModule {}
