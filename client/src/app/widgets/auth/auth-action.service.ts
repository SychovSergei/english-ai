import { UpdateWordPayload } from '@entities/word';
// import { LoginDialogComponent } from '@features/auth/login-dialog/ui/login-dialog.component';
import { LoggerService } from '@shared/lib/logger/logger.service';
import { LoginDialogComponent } from '@widgets/auth';

// import { LoginDialogComponent } from '@features/auth/login-dialog/ui/login-dialog.component';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class AuthActionService {
  private readonly dialog = inject(MatDialog);
  private readonly loggerService = inject(LoggerService).createLogger('AuthActionService');

  constructor() {
    console.log('AuthActionService constructor');
  }

  public login(): void {
    console.log('AuthActionService login');
    const dialogRef = this.dialog.open<LoginDialogComponent>(LoginDialogComponent, {
      // width: '100%',
      minHeight: '50%',
      minWidth: '300px',
      panelClass: 'no-scroll-dialog',
    });
    // OpenDialogWordData
    // { success: boolean; payload?: UpdateWordPayload }
    // , {
    //     data: { mode: 'edit', data: dataForForm },
    //   }

    dialogRef.afterClosed().subscribe((result: { success: boolean; payload?: UpdateWordPayload } | undefined) => {
      if (result?.success) {
        this.loggerService.log('Диалог LOGIN button закрылся:', result);
      }
    });
  }
}
