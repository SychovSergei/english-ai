import { HasId } from '@shared/interfaces';
import { DetailExpand } from '@shared/ui/data-table/data-table.animations';
import { ISort } from '@shared/ui/data-table/data-table.types';
import { IDataTablePageInfo } from '@shared/ui/data-table/pagination-info.interface';
import { UiKitModule } from '@shared/ui/ui-kit';

import { SelectionModel } from '@angular/cdk/collections';
import { JsonPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  EventEmitter,
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
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';

type HasIdType = HasId['id'];
type Templates = { [key: string]: TemplateRef<unknown> };

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [JsonPipe, MatTableModule, MatSort, MatSortHeader, NgTemplateOutlet, NgIf, UiKitModule, MatPaginator],
  animations: [DetailExpand],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T extends HasId> implements OnChanges, OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  @Input() tableData: T[] = [];
  @Input() totalCount: number = 0;

  // Флаг для переключения между режимами
  @Input() isExpandable: WritableSignal<boolean> = signal(false);
  @Input() isShowSelection: WritableSignal<boolean> = signal(false);

  @Input() ceilTemplates: Templates = {};
  templates: { [key: string]: TemplateRef<unknown> } = {};
  keys = Object.keys(this.templates);

  @Input() displayedColumns: string[] = [];
  @Input() columnsToDisplayWithExpandInput: string[] = [];
  @Input() sortedColumns: string[] = [];

  columns: WritableSignal<string[]> = signal(['select']);
  columnsToDisplayWithExpand: WritableSignal<string[]> = signal([]);

  @Input() pageSizeOptions: number[] = [10, 20, 50, 100];
  @Input() dataSource!: MatTableDataSource<T>;
  @Input() expandTemplate!: TemplateRef<unknown>;
  @Input() expandedElement!: T | null;

  @Input() selection: SelectionModel<T> = new SelectionModel<T>(true, []);
  @Output() selectionResult: EventEmitter<string[]> = new EventEmitter();
  @Output() pageChange: EventEmitter<IDataTablePageInfo> = new EventEmitter<IDataTablePageInfo>();
  @Output() sortChange: EventEmitter<ISort> = new EventEmitter<ISort>();

  public selectedMemo: WritableSignal<Map<HasIdType, T>> = signal(new Map([]));

  updateMap(operation: 'add' | 'delete', someId: HasIdType, someValue: T): void {
    this.selectedMemo.update((map) => {
      if (operation === 'add') map.set(someId, someValue);
      if (operation === 'delete') map.delete(someId);
      return map;
    });
    this.selectionResult.emit(Array.from(this.selectedMemo().keys()));
  }

  trackById(index: number, item: T): string {
    return item.id; // every element has unique `id`
  }

  constructor() {
    effect(
      () => {
        this.columnsToDisplayWithExpand.set(this.isExpandable() ? ['expand', ...this.columns()] : this.columns());
        // console.log(this.columnsToDisplayWithExpand());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        const sel = this.isShowSelection() ? ['select'] : [];
        // console.log(sel);
        this.columns.set(this.isShowSelection() ? [...sel, ...this.displayedColumns] : [...this.displayedColumns]);
      },
      { allowSignalWrites: true },
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['displayedColumns']) {
      const val = changes['displayedColumns'].currentValue;
      this.columns.set(val);
    }
    if (changes['columnsToDisplayWithExpandInput']) {
      const val = changes['columnsToDisplayWithExpandInput'].currentValue;
      this.columnsToDisplayWithExpand.set(this.isExpandable() ? ['expand', ...val] : [...val]);
    }
    if (changes['ceilTemplates']) {
      this.templates = changes['ceilTemplates'].currentValue;
      this.keys = Object.keys(this.templates);
    }
    if (changes['tableData']) {
      if (this.dataSource) {
        this.dataSource.data = changes['tableData'].currentValue;
        if (this.paginator) {
          this.paginator.length = this.totalCount;
        }
        this.selection.clear();
        this.dataSource.data.forEach((item) => {
          if (this.selectedMemo().has(item.id)) {
            // update selection values from cash - selectedMemo
            this.selection.select(item);
          }
        });
      }
    }

    if (changes['totalCount']) {
      // при изменении размера полученных данных переводим на первую страницу
      if (this.paginator) this.paginator.pageIndex = 0;
    }
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
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
        return this.selectedMemo().has(item.id);
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
        computed(() => (this.selection.isSelected(row) ? `deselect row ${row.id}` : `select row ${row.id}`)),
      );
    }
    return this.rowLabelCache.get(row)!;
  }

  public isRowSelected(row: T): boolean {
    return this.selectedMemo().has(row.id); //this.selection.isSelected(row) ||
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
    if (this.selectedMemo().has(obj.id)) this.deleteSelectionMemoSet(obj);
    else this.addSelectionMemoSet(obj);
    // console.log(Array.from(this.selectedMemo().keys()));
  }

  addSelectionMemoSet(obj: T): void {
    this.updateMap('add', obj.id, obj);
  }
  deleteSelectionMemoSet(obj: T): void {
    this.updateMap('delete', obj.id, obj);
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit({ pageSize: event.pageSize, length: event.length, pageIndex: event.pageIndex });
  }

  announceSortChange(event: Sort): void {
    console.log(event);
    this.sortChange.emit(event);
  }
}
