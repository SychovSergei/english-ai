import { UiKitModule } from '@shared/ui';

import { Component, inject, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-to-login',
  templateUrl: './to-login.component.html',
  styleUrls: ['./to-login.component.scss'],
  standalone: true,
  imports: [UiKitModule],
})
export class ToLoginComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() dialogRef: MatDialogRef<any, any> | null = inject(MatDialogRef, { optional: true });

  constructor(private router: Router) {}

  toLogin(): void {
    this.router.navigate(['/auth/login']);
    this.dialogRef?.close();
  }
}
