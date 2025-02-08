import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { JsonPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, effect, Input, OnInit, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';

import { WordTableData } from '../../../features/words/components/words.component';
// import { IWordTableData } from '../../../features/words/words.component';

export interface Identifiable {
  // id: string | number;
  id: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [JsonPipe, MatTableModule, MatCheckbox, MatIcon, MatIconButton, MatPaginator, NgTemplateOutlet, NgIf],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
// export class TableComponent<T extends Identifiable> implements OnInit {
export class TableComponent<T extends WordTableData> implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  private _columnInit: string[] = ['select'];
  // columnsAdditional: string[] = ['text', 'language', 'translations', 'voice'];

  columns: WritableSignal<string[]> = signal(['select']);
  @Input()
  set columnsInitial(val: string[]) {
    console.log('ИЗМЕНИЛИСЬ columns');
    this.columns.set([...this._columnInit, ...val]); // = [ ...this._columnInit, ...val];
  }

  @Input() dataSource!: MatTableDataSource<T>; // = new MatTableDataSource<T>([]);
  // @Input() selection!: SelectionModel<T>;// = new SelectionModel<T>(true, []);

  @Input() expandTemplate!: TemplateRef<unknown>; // = new MatTableDataSource<T>([]);

  isShowSelection: WritableSignal<boolean> = signal(true);
  @Input()
  set showSelection(val: boolean) {
    // console.log('ИЗМЕНИЛИСЬ isShowSelection');
    this.isShowSelection.set(val);
    // console.log('SHO W  W  W', this.isShowSelection());
  }

  templates: { [key: string]: TemplateRef<unknown> } = {};
  keys = Object.keys(this.templates);
  @Input()
  set ceilTemplates(data: { [key: string]: TemplateRef<unknown> }) {
    // console.log('ИЗМЕНИЛИСЬ шаблоны');
    this.templates = data;
    this.keys = Object.keys(this.templates);
  }

  // selection = signal(new SelectionModel<IWordTableData>(true, []));
  selection!: WritableSignal<SelectionModel<T>>; // = signal(new SelectionModel<IWordTableData>(true, []));
  @Input()
  set selectionInput(sel: WritableSignal<SelectionModel<T>>) {
    // console.log('ИЗМЕНИЛИСЬ selection');
    this.selection = sel; //.set(sel);
  }

  private _data!: WritableSignal<T[]>; // = signal([]);
  @Input()
  set data(value: WritableSignal<T[]>) {
    // console.log('ИЗМЕНИЛИСЬ ДАННЫЕ', value());
    this._data = value; //.set(value);
  }

  constructor() {
    // console.log('columns =', this.columns());
    effect(() => {
      // console.log('=====EFFECT==data===');
      // console.log('data', this._data());
      this.dataSource.data = this._data();
      this.dataSource.paginator = this.paginator;
    });
    effect(() => {
      // console.log('=====EFFECT==selection===');
      // console.log('selection====', this.selection());
    });
    effect(() => {
      // console.log('=====EFFECT==columns===');
      // console.log('columns columns columns ====', this.columns());
    });
    effect(() => {
      // console.log('=====EFFECT==columnsToDisplayWithExpand===');
      // console.log('columnsToDisplayWithExpand ====', this.columnsToDisplayWithExpand());
    });
  }

  columnsToDisplayWithExpand: WritableSignal<string[]> = signal(['expand', 'select', ...this.columns(), 'actions']);
  @Input()
  set columnsToDisplayWithExpandInput(val: string[]) {
    this.columnsToDisplayWithExpand.set(['expand', 'select', ...val]); //, 'actions'
    // console.log(this.columnsToDisplayWithExpand());
  }

  @Input() expandedElement!: T | null;

  ngOnInit() {
    // console.log('>> ngOnInitt his.columns', this.columns());
    // console.log('>> ngOnInit templates >>> ', this.templates);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection().selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection().clear();
      return;
    }

    this.selection().select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: T) {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection().isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  onCheckboxChange(event: MatCheckboxChange, row: T) {
    // console.log(event);
    // console.log(row);

    this.selection.update((selection) => {
      // console.log('UPDATE');
      selection.toggle(row);
      return selection; // Возвращаем обновлённый объект
    });
    // console.log(this.selection());

    // event.checked ? this.selection().select(row) : this.selection().deselect(row);
  }
}
