import { environment } from '@environments/index';
import { CustomSpinnerDirective } from '@shared/directives/custom-spinner.directive';

import { NgClass, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
// import { CustomSpinnerDirective } from '../../../shared/directives/custom-spinner.directive';

@Component({
  selector: 'user-activate-page',
  templateUrl: './user-activate-page.component.html',
  styleUrls: ['./user-activate-page.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatCardModule, NgIf, NgClass, CustomSpinnerDirective, MatProgressSpinnerModule],
})
export class UserActivatePageComponent implements OnInit {
  private readonly apiDomain = environment.apiDomain;
  private readonly apiUrl = 'api/users/activate';
  private readonly userActivateUrl: string = `${this.apiDomain}${this.apiUrl}`;
  message: string = '';
  isSuccess: boolean = false;
  isStartLoading: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const activationId = this.route.snapshot.paramMap.get('activationId');
    this.http
      .post(this.userActivateUrl, { activationId: activationId })
      .pipe(
        finalize(() => {
          this.isStartLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.message = 'user-model was activated success';
          this.isSuccess = true;
        },
        error: (err) => {
          if (err.error.code === 'user/already-activated' || err.error.code === 'user/wrong-activation-link') {
            this.message = err.error.message;
          } else {
            this.message = 'An unexpected error occurred.';
          }
        },
      });
  }

  click(): void {
    this.router.navigate(['/auth/login']);
  }
}
