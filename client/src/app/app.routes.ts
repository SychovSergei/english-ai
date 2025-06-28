import { AuthGuard } from '@core/guards/auth.guard';
import { NotFoundPage } from '@pages/not-found';
import { CreateWordSetComponent, EditWordSetComponent, WordSetsPage } from '@pages/word-sets';
import { WordsPage } from '@pages/words';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './layouts';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/auth/login',
  },
  { path: 'auth', loadChildren: () => import('@pages/auth/auth.module').then((m) => m.AuthModule) },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'words',
        // component: WordsComponent,
        // component: WordsPage,
        canActivate: [AuthGuard],
        data: {
          title: 'Words',
        },
        children: [
          { path: 'my-words', component: WordsPage },
          {
            path: 'word-set',
            children: [
              { path: 'create', component: CreateWordSetComponent },
              { path: 'edit/:id', component: EditWordSetComponent },
            ],
          },
          {
            path: 'manage',
            component: WordSetsPage,
            data: {
              title: 'Manage',
            },
          },
        ],
      },
      // {
      //   path: 'word-sets',
      //   component: WordSetsPage,
      //   canActivate: [AuthGuard],
      //   data: {
      //     title: 'Word Sets',
      //   },
      // },
    ],
  },
  { path: 'not-found', component: NotFoundPage },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutes {}
