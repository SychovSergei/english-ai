import { LoggerService } from '@shared/lib/logger/logger.service';
import { DetailExpand } from '@shared/ui/data-table/data-table.animations';
import { ISort } from '@shared/ui/data-table/data-table.types';
import { UiKitModule } from '@shared/ui/ui-kit';

import { SelectionModel } from '@angular/cdk/collections';
import { JsonPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  Signal,
  signal,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export type Template = { [key: string]: TemplateRef<unknown> };

export interface ColumnDefinition<T> {
  key: string;
  header: string;
  sortable?: boolean;
  // Позволяет передать кастомный шаблон для ячейки
  //// eslint-disable-next-line @typescript-eslint/no-explicit-any
  template?: TemplateRef<unknown>;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [JsonPipe, /*MatTableModule, */ MatSort, MatSortHeader, NgTemplateOutlet, NgIf, UiKitModule, MatPaginator],
  animations: [DetailExpand],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
// export class DataTableComponent<T extends WordEntity> implements OnChanges, OnInit, AfterViewInit {
export class DataTableComponent<T extends object> implements OnChanges, OnInit, AfterViewInit {
  private readonly loggerService = inject(LoggerService).createLogger('DataTableComponent');

  // @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() tableData: T[] = [];
  @Input() columns: ColumnDefinition<T>[] = [];
  // @Input() totalCount: number = 0;
  @Input() dataSource!: MatTableDataSource<T>;
  // @Input() displayedColumns: string[] = [];
  get columnsToDisplay(): string[] {
    return this.columns.map((column) => column.key);
  }

  // get ceilTemplates(): Templates {
  // get templates(): Templates {
  //   const templatesObj: Templates = {};
  //   for (const column of this.columns) {
  //     // console.log(column);
  //     if (column.template) {
  //       templatesObj[column.key] = column.template;
  //     }
  //   }
  //   // this.columns.map((column) => ({
  //   //   [column.key]: column.template,
  //   // }));
  //   return templatesObj;
  //   /*example::: this.displayedTemplates = {
  //     text: this.textTemplate,
  //     translations: this.translateValuesTemplate,
  //     voice: this.voiceTemplate,
  //     sync: this.syncStatusTemplate,
  //     actions: this.actionsTemplate,
  //   };*/
  // }

  @Input() ceilTemplates: Template = {};
  templates: Template = {};
  keys = Object.keys(this.templates);
  /** get keys(): string[] {
    return this.columns.map((column) => column.key);
    // Object.keys(this.templates);
  } */

  // Флаг для переключения между режимами
  @Input() isExpandable: WritableSignal<boolean> = signal(false);
  @Input() isShowSelection: WritableSignal<boolean> = signal(false);

  // @Input() columnsToDisplayWithExpand: string[] = [];
  @Input() sortedColumns: string[] = [];

  // columns: WritableSignal<string[]> = signal(['select']);
  columnsToDisplayWithExpand: WritableSignal<string[]> = signal([]);

  @Input() pageSizeOptions: number[] = [10, 20, 50, 100];
  @Input() expandTemplate!: TemplateRef<unknown>;
  @Input() expandedElement!: T | null;

  @Input() selection: SelectionModel<T> = new SelectionModel<T>(true, []);
  @Output() selectionResult: EventEmitter<string[]> = new EventEmitter();
  /** @Output() pageChange: EventEmitter<IDataTablePageInfo> = new EventEmitter<IDataTablePageInfo>();*/
  @Output() sortChange: EventEmitter<ISort> = new EventEmitter<ISort>();

  public selectedMemo: WritableSignal<Map<string, T>> = signal(new Map([]));

  updateMap(operation: 'add' | 'delete', someId: string, someValue: T): void {
    this.selectedMemo.update((map) => {
      if (operation === 'add') map.set(someId, someValue);
      if (operation === 'delete') map.delete(someId);
      return map;
    });
    this.selectionResult.emit(Array.from(this.selectedMemo().keys()));
  }

  trackById(index: number, item: T): string {
    return ''; //item.value.value; // every element has unique `id`
  }

  constructor() {
    effect(
      () => {
        // this.columnsToDisplayWithExpand.set(this.isExpandable() ? ['expand', ...this.columns()] : this.columns());
        const expandColumn = [{ key: 'expand', header: 'EEmpty' }];
        const selectColumn = [{ key: 'select', header: 'Empty' }];

        const expColumns = this.isExpandable() ? expandColumn.map((s) => s.key) : [];
        const selColumns = this.isShowSelection() ? selectColumn : [];

        this.columns = this.isShowSelection()
          ? [...selColumns, ...this.columns]
          : [...this.columns.filter((s) => s.key !== 'select')];

        this.columnsToDisplayWithExpand.set(
          // this.isExpandable() ? ['expand', ...this.displayedColumns] : [...this.displayedColumns],
          this.isExpandable() ? [...expColumns, ...this.columnsToDisplay] : [...this.columnsToDisplay],
        );
        // console.log(this.columnsToDisplayWithExpand());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        const selectColumn = [{ key: 'select', header: 'Empty' }];

        const sel = this.isShowSelection() ? ['select'] : [];
        // console.log(sel);
        // this.columns.set(this.isShowSelection() ? [...sel, ...this.displayedColumns] : [...this.displayedColumns]);
        const oldColumns = this.columns;
        // this.columns = [...(this.isShowSelection() ? selectColumn : []), ...oldColumns];
        // this.columns = this.isShowSelection()
        //   ? [...selectColumn, ...this.columns]
        //   : [...this.columns.filter((s) => s.key !== 'select')];
        // this.isShowSelection() ? [...sel, ...this.displayedColumns] : [...this.displayedColumns];
      },
      { allowSignalWrites: true },
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      const val = changes['displayedColumns'].currentValue;
      // this.columns.set(val);
      this.columns = val;
    }
    if (changes['displayedColumns']) {
      const val = changes['displayedColumns'].currentValue;
      // this.columns.set(val);
      this.columns = val;
    }
    if (changes['columnsToDisplayWithExpand']) {
      const val = changes['columnsToDisplayWithExpand'].currentValue;
      this.columnsToDisplayWithExpand.set(this.isExpandable() ? ['expand', ...val] : [...val]);
    }
    if (changes['ceilTemplates']) {
      this.templates = changes['ceilTemplates'].currentValue;
      this.keys = Object.keys(this.templates);
    }
    if (changes['tableData']) {
      // if (this.dataSource) {
      /** this.dataSource.data = changes['tableData'].currentValue;*/
      this.dataSource.data = this.tableData;
      this.dataSource.sort = this.sort;
      /**----- if (this.paginator) {
          this.paginator.length = this.totalCount;
        } */
      this.selection.clear();
      // this.dataSource.data.forEach((item) => {
      //   // if (this.selectedMemo().has(item.value.value)) {
      //   //   // update selection values from cash - selectedMemo
      //   //   this.selection.select(item);
      //   // }
      // });
      // }
    }

    // if (changes['totalCount']) {
    //   // при изменении размера полученных данных переводим на первую страницу
    //   /**----- if (this.paginator) this.paginator.pageIndex = 0;*/
    // }
  }

  ngOnInit(): void {
    /**----- this.dataSource.paginator = this.paginator;*/
    // this.updateAllSelectedState();
    // this.updateIndeterminateState();
    this.updateCheckboxState();
  }

  public isAllSelectedState = signal<boolean>(false);
  public isIndeterminateState = signal<boolean>(false);

  ngAfterViewInit(): void {
    this.selection.changed
      //TODO take until exists component
      .pipe
      // tap((v) => {
      //   console.log('selection.changed', v);
      //   v.added.forEach((item) => console.log(item.id));
      // }),
      ()
      .subscribe(() => this.updateCheckboxState());
  }

  updateCheckboxState(): void {
    this.updateAllSelectedState();
    this.updateIndeterminateState();
  }
  updateAllSelectedState(): void {
    this.isAllSelectedState.set(this.selection.hasValue() && this.isAllSelected() && this.selectedMemo().size > 0);
  }
  updateIndeterminateState(): void {
    this.isIndeterminateState.set(!this.isAllSelected() && this.selectedMemo().size > 0);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return (
      numSelected === numRows &&
      numSelected > 0 &&
      this.selection.selected.every((item) => {
        // return this.selectedMemo().has(item.value.value);
        return true;
      })
    );
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.selected.forEach((item) => this.deleteSelectionMemoSet(item));
      this.selection.clear();
      this.updateCheckboxState();
      return;
    }

    this.selection.select(...this.dataSource.data);
    this.selection.setSelection(...this.dataSource.data);
    this.selection.selected.forEach((item) => this.addSelectionMemoSet(item));

    this.updateCheckboxState();
  }

  /** The label for the checkbox on the passed row */
  public checkboxLabel = computed(() => {
    // console.log('checkboxLabel пересчитан');
    return this.isAllSelectedState() ? 'deselect all' : 'select all';
  });
  // Кэш для `computed` значений
  private rowLabelCache = new WeakMap<T, Signal<string>>();
  public rowCheckboxLabel(row: T): Signal<string> {
    if (!this.rowLabelCache.has(row)) {
      this.rowLabelCache.set(
        row,
        computed(() => (this.selection.isSelected(row) ? `deselect row {row.value}` : `select row {row.value}`)),
      );
    }
    return this.rowLabelCache.get(row)!;
  }

  public isRowSelected(row: T): boolean {
    // return this.selectedMemo().has(row.value.value); //this.selection.isSelected(row) ||
    return true;
  }

  public onCheckboxChange(event: MatCheckboxChange, row: T): void {
    if (event.checked) {
      this.selection.select(row);
    } else {
      this.selection.deselect(row);
    }
    this.toggleSelectionMemoSet(row);

    this.updateCheckboxState();
  }

  toggleSelectionMemoSet(obj: T): void {
    /** if (this.selectedMemo().has(obj.value.value)) this.deleteSelectionMemoSet(obj);
    else this.addSelectionMemoSet(obj);*/
    // console.log(Array.from(this.selectedMemo().keys()));
  }

  addSelectionMemoSet(obj: T): void {
    /** this.updateMap('add', obj.value.value, obj);*/
  }
  deleteSelectionMemoSet(obj: T): void {
    /** this.updateMap('delete', obj.value.value, obj);*/
  }

  /** onPageChange(event: PageEvent): void {
    this.pageChange.emit({ pageSize: event.pageSize, length: event.length, pageIndex: event.pageIndex });
  }*/

  onSort(event: Sort): void {
    this.loggerService.log('onSort event', event);
    this.sortChange.emit(event);
  }
}
