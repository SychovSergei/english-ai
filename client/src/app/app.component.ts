import { UserService } from '@features/user/model/user.service';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AsyncPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginService } from '@features/auth';
import { TokenService } from '@shared/infrastructure';

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
    public loginService: LoginService,
    public tokenService: TokenService,
    private translate: TranslateService,
  ) {
    this.translate.addLangs(['en', 'ua']);
    this.translate.setDefaultLang('en');
    this.translate.use(this.translate.getBrowserLang() || 'en');
  }

  ngOnInit(): void {
    const token = this.tokenService.getAccessToken();
    if (token) {
      if (!this.tokenService.checkTokenValidity(token)) {
        this.tokenService.removeAccessToken();
      }

      this.userService.loadUserFromToken().subscribe((user) => {
        if (!user) {
          this.loginService.logout().subscribe();
        }
      });
    }
  }
}
