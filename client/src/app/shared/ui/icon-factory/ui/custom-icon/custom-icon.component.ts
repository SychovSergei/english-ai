import { IIconComponent } from '@shared/ui/icon-factory';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-icon',
  templateUrl: './custom-icon.component.html',
  styleUrls: ['./custom-icon.component.scss'],
  standalone: true,
})
export class CustomIconComponent implements IIconComponent {
  @Input() data!: string; //example: 'assets/icons/custom-icon.svg'
}
