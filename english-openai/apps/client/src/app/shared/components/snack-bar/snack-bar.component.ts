import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { SnackBarMessage } from '../../../core/services/error.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, NgClass],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss',
})
export class SnackBarComponent {
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
      console.log('success');
    } else {
      console.log('else');
    }
    console.log('data.type', this.data.type);
  }
}
