import { UiKitModule } from '@shared/ui';

import { Component, inject, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-to-register',
  templateUrl: './to-register.component.html',
  styleUrls: ['./to-register.component.scss'],
  standalone: true,
  imports: [UiKitModule],
})
export class ToRegisterComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() dialogRef: MatDialogRef<any, any> | null = inject(MatDialogRef, { optional: true });

  constructor(private router: Router) {}

  toRegister(): void {
    this.router.navigate(['/auth/register']);
    this.dialogRef?.close();
  }
}
