import { ChangeDetectionStrategy, Component } from '@angular/core';

// TODO Check if this is needed
@Component({
  selector: 'app-data-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableWidgetComponent {}
