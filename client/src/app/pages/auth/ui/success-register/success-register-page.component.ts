import { CustomSpinnerDirective } from '@shared/directives/custom-spinner.directive';
import { LoggerService } from '@shared/lib/logger/logger.service';

import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success-register-page',
  templateUrl: './success-register-page.component.html',
  styleUrls: ['./success-register-page.component.scss'],
  standalone: true,
  imports: [MatCardModule, CustomSpinnerDirective, MatButtonModule, MatProgressSpinnerModule, NgIf],
})
export class SuccessRegisterPageComponent implements OnInit {
  private readonly logger = inject(LoggerService).createLogger('SuccessRegisterPageComponent');

  email: string = '';
  clientName: string = 'Client';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as {
      email: string;
      fullName: string;
    };
    this.logger.log('state', JSON.stringify(state, null, 2));

    if (state.email) this.email = state.email;
    if (state.fullName) this.clientName = state.fullName;
  }

  ngOnInit(): void {
    // this.logger.log('SuccessRegisterPageComponent');
    // this.route.queryParams.subscribe((params: Params) => {
    //   if (params['email']) this.email = params['email'];
    //   this.logger.log(params['name']);
    //   if (params['name']) {
    //     this.clientName = params['firstName'] + ' ' + params['lastName'];
    //   }
    //   this.loggerService.log(this.email);
    //   this.loggerService.log(this.clientName);
    // });
  }

  click(): void {
    this.router.navigate(['/auth/login']);
  }
}
