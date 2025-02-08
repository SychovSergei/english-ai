import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from '../layout/auth-layout/auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SuccessRegisterPageComponent } from './components/success-register-page/success-register-page.component';
import { UserActivatePageComponent } from './components/user-activate-page/user-activate-page.component';

const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'Login',
        },
      },
      {
        path: 'register',
        component: RegisterComponent,
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
