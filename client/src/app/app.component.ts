import { marker as _ } from '@colsen1991/ngx-translate-extract-marker';
import { UserService } from '@features/user/model/user.service';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, AsyncPipe, RouterOutlet, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  title = 'title.originalKey';

  constructor(
    private userService: UserService,
    private translate: TranslateService,
  ) {
    this.translate.addLangs(['en', 'ua']);
    this.translate.setDefaultLang('en');
    this.translate.use(this.translate.getBrowserLang() || 'en');
  }

  ngOnInit(): void {
    // this.userService.getCurrentUserInfo();
    this.userService.loadUserFromToken();
  }

  useLanguage(language: string): void {
    console.log('--------------');
    this.translate.use(language);
    // this.i18nService.initLanguage(language);
    // const ddd = languages.find((lang) => lang.key === language);
    // if (ddd) this.i18nService.setLanguage(ddd);
  }
}
