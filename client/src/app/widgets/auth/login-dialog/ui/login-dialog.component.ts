import { AuthByEmailFormComponent, SocialAuthComponent, ToLoginComponent, ToRegisterComponent } from '@features/auth';
import { DialogComponent } from '@shared/ui';
import { LoginFormWidget } from '@widgets/auth';

import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  standalone: true,
  imports: [
    DialogComponent,
    MatButton,
    MatIcon,
    MatProgressSpinner,
    NgIf,
    LoginFormWidget,
    AuthByEmailFormComponent,
    SocialAuthComponent,
    ToLoginComponent,
    ToRegisterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginDialogComponent {
  public isSubmitting: WritableSignal<boolean> = signal(false);
  public isButtonDisabled: WritableSignal<boolean> = signal(false);

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>) {
    console.log('LoginDialogComponent constructor');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {}
}
