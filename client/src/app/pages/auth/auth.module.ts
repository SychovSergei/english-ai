import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthLayoutComponent } from '../../layouts';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [CommonModule, RouterOutlet, AuthRoutingModule, AuthLayoutComponent],
  declarations: [],
  exports: [AuthLayoutComponent],
  providers: [],
})
export class AuthModule {}
