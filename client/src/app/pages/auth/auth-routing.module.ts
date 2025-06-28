import { RegisterComponent } from '@features/auth';
import {
  LoginPageComponent,
  RegisterPageComponent,
  SuccessRegisterPageComponent,
  UserActivatePageComponent,
} from '@pages/auth';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from '../../layouts';

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
        component: RegisterComponent,
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
