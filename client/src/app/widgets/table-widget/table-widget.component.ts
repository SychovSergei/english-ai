import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-data-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableWidgetComponent {}
