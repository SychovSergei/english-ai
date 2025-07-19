import { Word, WordService } from '@entities/word';
import { WordsResponseDTO } from '@entities/word/api/WordRepoDTO';
import { ISortTable, WordsRequest } from '@entities/word/model/word.types';
import { AddWordDialogComponent } from '@features/words/add-word-dialog';
import { mapWordToFormValue } from '@features/words/add-word-dialog/model/word-form.mapper';
// import { FilterService } from '@features/table-filter/services/table-filter.service';
import { WORD_SERVICE_TOKEN } from '@features/words/model/word.tokens';
import { OpenDialogWordData } from '@features/words/types/open-dialog-word-data';
import { DataTableComponent } from '@shared/ui';
import { IDataTablePageInfo } from '@shared/ui/data-table/pagination-info.interface';
import { TableFilterService } from '@shared/ui/table-filter';

import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  Input,
  OnChanges,
  OnInit,
  Signal,
  signal,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';

import { WordTableFacade } from '../../model/word-table.facade';

@Component({
  selector: 'app-word-table',
  templateUrl: './word-table.component.html',
  styleUrl: './word-table.component.scss',
  standalone: true,
  providers: [
    // { provide: API_DOMAIN, useValue: environment.apiDomain },
    // { provide: API_WORDS_URL, useValue: 'api/words' }, //TODO from entity or feature????
    { provide: WORD_SERVICE_TOKEN, useClass: WordService },
  ],
  imports: [DataTableComponent, MatIcon, MatMenuItem, MatMenu, MatIconButton, MatMenuTrigger],
})
export class WordTableComponent implements OnChanges, OnInit, AfterViewInit {
  // @Input() filterId: string = '';

  isExpandable: WritableSignal<boolean> = signal(false);
  isShowSelection: WritableSignal<boolean> = signal(false);

  /** передаю тип данных для таблицы */
  dataSourceWordType = new MatTableDataSource<Word>([]);
  /** данные для таблицы */
  tableWordData: WritableSignal<Word[]> = signal([]);

  displayedColumns: string[] = ['text', 'translations', 'voice', 'actions']; //'language',
  columnsToDisplayWithExpand = [...this.displayedColumns];
  sortedColumns: string[] = ['text'];

  pageSizeOptions: number[] = [10, 20, 50];
  expandedElement!: Word | null;
  // selection: WritableSignal<SelectionModel<Word>> = signal(new SelectionModel<Word>(true, []));

  private _initialSelection = [];
  private _allowMultiSelect = true;
  selection: SelectionModel<Word> = new SelectionModel<Word>(this._allowMultiSelect, this._initialSelection);
  // totalCount: WritableSignal<number> = signal(0);
  totalCount: number = 0;

  // Сигналы для параметров запроса
  // private $filter!: Observable<string>; // = signal('');
  @Input() globalFilter: string = '';
  private filter: WritableSignal<string> = signal('');
  private offset: WritableSignal<number> = signal(0);
  private limit: WritableSignal<number> = signal(this.pageSizeOptions[0]);
  private sort: WritableSignal<Sort> = signal({ active: '', direction: '' });
  //TODO sort()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('expandTemplate', { static: false }) expandTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('text', { static: false }) textTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('translations', { static: false }) translateValuesTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('voice', { static: false }) voiceTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('actions', { static: false }) actionsTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayedTemplates: { [key: string]: TemplateRef<any> } = {};

  readonly dialog = inject(MatDialog);

  // reqParamObj: WordsRequest = {
  //   filter: this.filter(),
  //   limit: this.limit(),
  //   offset: this.offset(),
  //   sortName: this.sort().active,
  //   sortDirection: this.sort().direction,
  // };
  reqParamObj: Signal<WordsRequest> = computed<WordsRequest>(() => ({
    filter: this.filter(),
    limit: this.limit(),
    offset: this.offset(),
    sortName: this.sort().active,
    sortDirection: this.sort().direction,
  }));

  constructor(
    private wordFacade: WordTableFacade,
    private tableFilterService: TableFilterService,
  ) {
    // this.$filter = this.tableFilterService.getFilter(this.filterId);

    // this.reqParamObj = computed<WordsRequest>(() => ({
    //   filter: this.globalFilter,
    //   limit: this.limit(),
    //   offset: this.offset(),
    //   sortName: this.sort().active,
    //   sortDirection: this.sort().direction,
    // }));

    // console.log(this.filterId);
    effect(() => {
      // console.log('EFFECT');
      this.filter();
    });
    effect(
      () => {
        // console.log('EFFECT filter changed', this.filter());
        this.filter();
        this.offset.set(0);
      },
      // { allowSignalWrites: true },
    );
    effect(() => {
      // console.log('reqParamObj changed >>>>>>', this.reqParamObj());
      this.loadTableData();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['globalFilter']) {
      this.filter.set(this.globalFilter);
      // queueMicrotask(() => {
      //   const value = this.tableFilterService.getFilter(this.filterId)();
      // });
    }
  }

  ngOnInit(): void {
    // this.filterset(this.tableFilterService.getFilter(this.filterId)());
    // this.$filter.subscribe((val) => {
    //   console.log(val);
    //   this.filter = val;
    // });
  }

  ngAfterViewInit(): void {
    this.displayedTemplates = {
      text: this.textTemplate,
      translations: this.translateValuesTemplate,
      voice: this.voiceTemplate,
      actions: this.actionsTemplate,
    };
  }

  refreshTable(): void {
    // console.log('refreshTable', this.reqParamObj());
    this.loadTableData();
  }

  loadTableData(): void {
    this.wordFacade
      .getWords(this.reqParamObj())
      .pipe(take(1))
      .subscribe((data: WordsResponseDTO) => {
        // console.log('data from server', data);
        this.tableWordData.set(data.words as Word[]); // TODO!!! "as" разобраться с ИНТЕРФЕЙСАМИ И ДАННЫМИ
        this.totalCount = data.total;
      });
  }

  getVoice(event: MouseEvent): void {
    event.stopPropagation();
  }

  preventMenu(event: Event): void {
    event.stopPropagation();
  }

  editWordDialogOpen(event: Event, data: Word): void {
    const mappedData = mapWordToFormValue(data);
    this.dialog // TODO - MAYBE REPLACE WITH FACADE SERVICE ???
      .open<AddWordDialogComponent, OpenDialogWordData, { success: boolean }>(AddWordDialogComponent, {
        data: { data: mappedData, mode: 'edit' },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          // console.log('Диалог EDIT button закрылся:', result);
          if (result.success) this.refreshTable();
        }
      });
  }

  addToWordSet(event: Event, data: Word): void {
    console.log('add To Word Set', data);
    // this.dialog.open<AddWordDialogComponent, OpenDialogWordData, boolean>(AddWordDialogComponent, {
    //   data: { data: data, mode: 'edit' },
    // });
  }

  deleteWord(event: Event, data: Word): void {
    console.log('delete', data);
    // this.dialog.open<AddWordDialogComponent, OpenDialogWordData, boolean>(AddWordDialogComponent, {
    //   data: { data: data, mode: 'edit' },
    // });
  }

  onPageChange(value: IDataTablePageInfo): void {
    this.limit.set(value.pageSize);
    this.offset.set(value.pageSize * value.pageIndex);
  }
  onSortChange(value: ISortTable): void {
    this.sort.set(value);
  }

  onSelectionResult(selectionIds: string[]): void {
    console.log('onSelectionResult', selectionIds);
  }
}
