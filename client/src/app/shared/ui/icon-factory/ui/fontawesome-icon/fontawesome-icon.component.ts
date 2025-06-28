import { IIconComponent } from '@shared/ui/icon-factory';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fa-icon',
  templateUrl: './fontawesome-icon.component.html',
  styleUrls: ['./fontawesome-icon.component.scss'],
  standalone: true,
})
export class FontAwesomeIconComponent implements IIconComponent {
  @Input() data!: string;
}
