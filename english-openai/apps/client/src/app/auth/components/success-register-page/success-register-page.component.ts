import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { CustomSpinnerDirective } from '../../../shared/directives/custom-spinner.directive';

@Component({
  selector: 'app-success-register-page',
  templateUrl: './success-register-page.component.html',
  styleUrls: ['./success-register-page.component.scss'],
  standalone: true,
  imports: [MatCardModule, CustomSpinnerDirective, MatButtonModule, MatProgressSpinnerModule, NgIf],
})
export class SuccessRegisterPageComponent implements OnInit {
  email: string = '';
  clientName: string = 'Client';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    console.log('SuccessRegisterPageComponent');
    this.route.queryParams.subscribe((params: Params) => {
      if (params['email']) this.email = params['email'];
      console.log(params['name']);
      if (params['name']) {
        this.clientName = params['firstName'] + ' ' + params['lastName'];
      }
      console.log(this.email);
      console.log(this.clientName);
    });
  }

  click() {
    this.router.navigate(['/auth/login']);
  }
}
