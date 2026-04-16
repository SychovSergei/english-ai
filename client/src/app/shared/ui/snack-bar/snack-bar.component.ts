import { LoggerService } from '@shared/lib/logger/logger.service';
import { SnackBarMessage } from '@shared/services/error.service';
import { UiKitModule } from '@shared/ui/ui-kit';

import { NgClass } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [UiKitModule, NgClass],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss',
})
export class SnackBarComponent {
  private readonly loggerService = inject(LoggerService).createLogger('SnackBarComponent');
  snackBarRef = inject(MatSnackBarRef);
  type: string = '';

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarMessage) {
    switch (this.data.type) {
      case 'success':
        this.type = 'Success';
        break;
      case 'error':
        this.type = 'Error';
        break;
      case 'info':
        this.type = 'Info';
        break;
      default:
        this.type = '';
    }
    if (this.data.type === 'success') {
      this.loggerService.log('success');
    } else {
      this.loggerService.log('else');
    }
    this.loggerService.log('data.type', this.data.type);
  }
}
