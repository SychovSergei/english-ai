import { WordEntity, WordFacade } from '@entities/word';
import { WordActionsService } from '@features/words';
import { LoggerService } from '@shared/lib/logger/logger.service';
import { ColumnDefinition, DataTableComponent, Template } from '@shared/ui/data-table/data-table.component';
import { SortTable } from '@shared/ui/data-table/data-table.types';
import { UiKitModule } from '@shared/ui/ui-kit';
import { WordTableVm } from '@widgets/word-table';

import { SelectionModel } from '@angular/cdk/collections';
import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
// import { WordTableVm } from '../model/word-table-view.model';

@Component({
  selector: 'app-word-table-wrapper',
  templateUrl: './word-table-wrapper.component.html',
  styleUrl: './word-table-wrapper.component.scss',
  standalone: true,
  providers: [
    // { provide: API_DOMAIN, useValue: environment.apiDomain },
    // { provide: API_WORDS_URL, useValue: 'api/words' }, //TODO from entity or feature????
    // { provide: WORD_SERVICE_TOKEN, useClass: WordService },
    // { provide: WordActionsService, useClass: WordActionsService },
  ],
  imports: [
    UiKitModule,
    DataTableComponent,
    MatMenuItem,
    MatMenu,
    MatMenuTrigger,
    DataTableComponent,
    JsonPipe,
    AsyncPipe,
    MatPaginator,
  ],
})
export class WordTableWrapperComponent implements OnChanges, OnInit, AfterViewInit {
  // TODO INFO: использую для отображения даных таблицы Words

  private readonly destroyRef = inject(DestroyRef);
  private readonly loggerService = inject(LoggerService).createLogger('WordTableWrapperComponent');
  private readonly wordFacade = inject(WordFacade);
  private readonly wordActionsService = inject(WordActionsService);

  @Input() globalFilter: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  @ViewChild('expandTpl', { static: false }) expandTemplate!: TemplateRef<unknown>;

  @ViewChild('wordValueTpl', { static: false }) textTemplate!: TemplateRef<unknown>;
  @ViewChild('translationsTpl', { static: false }) translateValuesTemplate!: TemplateRef<unknown>;
  @ViewChild('voiceTpl', { static: false }) voiceTemplate!: TemplateRef<unknown>;
  @ViewChild('syncStatusTpl', { static: false }) syncStatusTemplate!: TemplateRef<unknown>;
  @ViewChild('actionsTpl', { static: false }) actionsTemplate!: TemplateRef<unknown>;
  displayedTemplates: Template = {};

  // @Input() filterId: string = '';
  public tableColumns: ColumnDefinition<WordTableVm>[] = [];
  expandedElement!: WordTableVm | null;

  isExpandable: WritableSignal<boolean> = signal(true);
  isShowSelection: WritableSignal<boolean> = signal(true);

  /** передаю тип данных для таблицы */
  // dataSourceWordType = new MatTableDataSource<WordEntity>([]);
  public dataSource = new MatTableDataSource<WordTableVm>([]);
  /** данные для таблицы */
  // tableWordData: WritableSignal<WordEntity[]> = signal([]);
  tableWordData: WritableSignal<WordTableVm[]> = signal([]);

  displayedColumns: string[] = ['wordValue', 'translations', 'voice', 'actions']; //'language',
  // columnsToDisplayWithExpand = [...this.displayedColumns];
  sortedColumns: string[] = ['wordValue'];

  pageSizeOptions: number[] = [10, 20, 50];
  // expandedElement!: WordEntity | null;
  // selection: WritableSignal<SelectionModel<Word>> = signal(new SelectionModel<Word>(true, []));

  private _initialSelection = [];
  private _allowMultiSelect = true;
  // selection: SelectionModel<WordEntity> = new SelectionModel<WordEntity>(
  //   this._allowMultiSelect,
  //   this._initialSelection,
  // );
  selection: SelectionModel<WordTableVm> = new SelectionModel<WordTableVm>(
    this._allowMultiSelect,
    this._initialSelection,
  );
  // totalCount: WritableSignal<number> = signal(0);
  // totalCount: number = 0;

  private sort: WritableSignal<Sort> = signal({ active: '', direction: '' });
  // TODO sort()

  // Сигналы для параметров запроса
  // private $filter!: Observable<string>; // = signal('');
  private filter: WritableSignal<string> = signal('');
  private offset: WritableSignal<number> = signal(0);
  private limit: WritableSignal<number> = signal(this.pageSizeOptions[0]);

  // readonly dialog = inject(MatDialog);

  // reqParamObj: WordsRequest = {
  //   filter: this.filter(),
  //   limit: this.limit(),
  //   offset: this.offset(),
  //   sortName: this.sort().active,
  //   sortDirection: this.sort().direction,
  // };
  /** reqParamObj: Signal<WordsRequest> = computed<WordsRequest>(() => ({
    filter: this.filter(),
    limit: this.limit(),
    offset: this.offset(),
    sortName: this.sort().active,
    sortDirection: this.sort().direction,
  }));*/

  constructor() {
    // private offlineStorage: OfflineStorageService, // Для статусов синхронизации // private wordActionsService: WordActionsService, // private tableFilterService: TableFilterService, // private readonly wordFacade: WordFacade, // private wordFacade: WordTableFacade,
    // this.$filter = this.tableFilterService.getFilter(this.filterId);

    // this.reqParamObj = computed<WordsRequest>(() => ({
    //   filter: this.globalFilter,
    //   limit: this.limit(),
    //   offset: this.offset(),
    //   sortName: this.sort().active,
    //   sortDirection: this.sort().direction,
    // }));

    effect(
      () => {
        // console.log('EFFECT filter changed', this.filter());
        this.filter();
        this.offset.set(0);
      },
      { allowSignalWrites: true },
    );
    effect(async () => {
      // console.log('reqParamObj changed >>>>>>', this.reqParamObj());
      // this.loadTableData();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['globalFilter']) {
      this.filter.set(this.globalFilter);
      // console.log('globalFilter changed', this.globalFilter, this.filter());

      this.wordFacade.setFilter(this.globalFilter, null);
      // queueMicrotask(() => {
      //   const value = this.tableFilterService.getFilter(this.filterId)();
      // });
    }
  }

  ngOnInit(): void {
    /** this.wordFacade.words$.pipe(take(1)).subscribe((words) => {
      console.log('words from store', words);
      this.tableWordData.set(words); // TODO!!! "as" разобраться с ИНТЕРФЕЙСАМИ И ДАННЫМИ
    }); */
    this.wordFacade.filteredWords$
      .pipe(
        map((words) => {
          return words.map((entity) => this.mapToViewModel(entity));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((words) => {
        // console.log('wordFacade.words$.pipe', words);
        // console.log('this.filter()', this.filter());
        this.tableWordData.set(words);
        this.dataSource.data = words;
        //   .filter((word) =>
        //   this.filter() ? word.wordValue.toLowerCase().includes(this.filter().toLowerCase()) : word,
        // );
        this.dataSource.paginator = this.paginator;
      });
    // this.loadTableData();

    this.tableColumns = [
      { key: 'wordValue', header: 'Слово', sortable: true, template: this.textTemplate },
      { key: 'translations', header: 'Перевод', template: this.translateValuesTemplate },
      { key: 'voice', header: 'Слово', template: this.voiceTemplate },
      { key: 'sync', header: 'Статус', sortable: true, template: this.syncStatusTemplate },

      { key: 'actions', header: 'Дия', template: this.actionsTemplate },
    ];
  }

  ngAfterViewInit(): void {
    this.displayedTemplates = {
      wordValue: this.textTemplate,
      translations: this.translateValuesTemplate,
      voice: this.voiceTemplate,
      sync: this.syncStatusTemplate,
      actions: this.actionsTemplate,
    };
    // this.tableColumns = [
    //   // { key: 'select', header: 'Select' },
    //   { key: 'wordValue', header: 'Слово', sortable: true, template: this.textTemplate },
    //   { key: 'translations', header: 'Перевод', template: this.translateValuesTemplate },
    //   { key: 'voice', header: 'Слово', template: this.voiceTemplate },
    //   { key: 'sync', header: 'Статус', sortable: true, template: this.syncStatusTemplate },
    //
    //   { key: 'actions', header: 'Дия', template: this.actionsTemplate },
    // ];
  }

  refreshTable(): void {
    console.log(' -> refreshTable');
    // this.loadTableData();
    this.wordFacade
      .loadAll()
      .then(() => {
        this.loggerService.log('loadAll() END');
      })
      .catch((err) => {
        this.loggerService.error(err);
      });
  }

  public getVoice(event: MouseEvent): void {
    event.stopPropagation();
  }

  public preventMenu(event: Event): void {
    event.stopPropagation();
  }

  public async editWord(event: Event, data: WordTableVm): Promise<void> {
    this.loggerService.log('editWord', data);

    await this.wordActionsService.editWord(data.id);
  }

  addToWordSet(event: Event, data: WordEntity): void {
    this.loggerService.log('add To Word Set', data);
    // this.dialog.open<AddWordDialogComponent, OpenDialogWordData, boolean>(AddWordDialogComponent, {
    //   data: { data: data, mode: 'edit' },
    // });
  }

  public async deleteWord(event: Event, data: WordTableVm): Promise<void> {
    this.loggerService.log('delete', data);
    await this.wordFacade.deleteWord(data.id);
    // this.dialog.open<AddWordDialogComponent, OpenDialogWordData, boolean>(AddWordDialogComponent, {
    //   data: { data: data, mode: 'edit' },
    // });
  }

  /** onPageChange(value: IDataTablePageInfo): void {
    this.limit.set(value.pageSize);
    this.offset.set(value.pageSize * value.pageIndex);

    console.log('pageSize - limit', this.limit());
    console.log('pageIndex - offset', this.offset());
  }*/
  public onSortChange(value: SortTable): void {
    console.log('onSortChange', value);
    this.sort.set(value);
  }

  onSelectionResult(selectionIds: string[]): void {
    this.loggerService.log('onSelectionResult', selectionIds);
  }

  // private mapToViewModel(word: OfflineEntry<WordEntity>): WordTableVm {
  private mapToViewModel(word: WordEntity): WordTableVm {
    return {
      id: word.id.value,
      wordValue: word.value.value,
      translations: word.getProps().translations.map((t) => t.value),
      mainTranslation: word.getProps().translations[0].value,
      translationsCount: word.getProps().translations.length,
      synced: word.metadata.synced,
      updatedAt: word.getProps().updatedAt,
    };
  }
}
