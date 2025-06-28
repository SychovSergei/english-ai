import { NgModule } from '@angular/core';
import { MatButton, MatButtonModule, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel } from '@angular/material/snack-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';

@NgModule({
  imports: [
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatDivider,
    MatIcon,
    MatButton,
    MatIconButton,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardSubtitle,
    MatCardTitle,
    MatToolbar,
    MatTooltip,
    MatCheckbox,
    MatError,
    MatProgressSpinner,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatMiniFabButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
  ],
  exports: [
    MatProgressSpinner,
    MatError,
    MatSelect,
    MatOption,
    MatCheckbox,
    MatFormField,
    MatDivider,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardSubtitle,
    MatCardTitle,
    MatButton,
    MatLabel,
    MatFormFieldModule,
    MatInput,
    MatIconButton,
    MatIcon,
    MatToolbar,
    MatTooltip,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatMiniFabButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatAccordion,
  ],
})
export class UiKitModule {}
