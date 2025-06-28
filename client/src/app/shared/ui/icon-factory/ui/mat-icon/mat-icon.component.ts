import { IIconComponent } from '@shared/ui/icon-factory';

import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-mat-icon',
  templateUrl: './mat-icon.component.html',
  styleUrls: ['./mat-icon.component.scss'],
  standalone: true,
  imports: [MatIcon],
})
export class MaterialIconComponent implements IIconComponent {
  @Input() data!: string;
  @Input() color: string = 'inherit'; // TODO проверить изменинение этого свойства
}
