import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from '../../layouts';
import { LoginPageComponent } from './ui/login/login.page.component';
import { RegisterPageComponent } from './ui/register/register.page.component';
import { SuccessRegisterPageComponent } from './ui/success-register/success-register-page.component';
import { UserActivatePageComponent } from './ui/user-activate/user-activate-page.component';

const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
        data: {
          title: 'Login',
        },
      },
      {
        path: 'register',
        component: RegisterPageComponent,
        data: {
          title: 'Registration',
        },
      },
      {
        path: 'confirm-email/:token',
        component: RegisterPageComponent,
        data: {
          title: 'Confirm Email',
        },
      },
      {
        path: 'success-register',
        component: SuccessRegisterPageComponent,
      },
      {
        path: 'user-activate/:activationId',
        component: UserActivatePageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
