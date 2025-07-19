import { ITableActions } from '@shared/ui/data-table-actions';
import { IconFactoryService } from '@shared/ui/icon-factory';
import { UiKitModule } from '@shared/ui/ui-kit';

import { AfterViewInit, Component, Input, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-data-table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.scss'],
  standalone: true,
  imports: [UiKitModule],
})
export class TableActionsComponent implements AfterViewInit {
  @ViewChildren('iconContainer', { read: ViewContainerRef }) iconContainers!: QueryList<ViewContainerRef>;

  @Input() actions: ITableActions[] = [];

  constructor(private iconFactoryService: IconFactoryService) {}

  ngAfterViewInit(): void {
    this.iconContainers.forEach((container, index) => {
      const action = this.actions[index];
      // this.iconFactoryService.createIcon(container, action.icon, action.iconType);
      this.iconFactoryService.createIcon(container, { type: action.iconType, name: action.icon });
    });
  }
}
