import { Component, Input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule],
})
export class DialogComponent {
  @Input() title: string = 'Title';
  @Input() showActions: boolean = true;

  constructor() {
    console.log('DialogComponent constructor');
  }
}
