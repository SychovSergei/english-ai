import { ITableActions } from '@shared/ui';
import { IconFactoryService } from '@shared/ui/icon-factory';

import { AfterViewInit, Component, inject, Input, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-data-table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.scss'],
  standalone: true,
  imports: [MatButton],
})
export class TableActionsComponent implements AfterViewInit {
  // TODO INFO: использую для создания кнопок в header таблицы

  private iconFactoryService = inject(IconFactoryService);

  @ViewChildren('iconContainer', { read: ViewContainerRef }) iconContainers!: QueryList<ViewContainerRef>;

  @Input() actions: ITableActions[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.iconContainers.forEach((container, index) => {
      const action = this.actions[index];
      // this.iconFactoryService.createIcon(container, action.icon, action.iconType);
      this.iconFactoryService.createIcon(container, { type: action.iconType, name: action.icon });
    });
  }
}
