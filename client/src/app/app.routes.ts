import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WordsComponent } from './features/words/words.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'words',
        component: WordsComponent,
        data: {
          title: 'Words',
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutes {}
