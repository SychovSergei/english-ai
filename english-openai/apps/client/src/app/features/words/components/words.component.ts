import { SelectionModel } from '@angular/cdk/collections';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  Inject,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { ELangs } from '@shared/enums/langs.enum';
import { ELevels } from '@shared/enums/levels.enum';
import { ELexicalCategory } from '@shared/enums/lexical-categories.enum';
import { delay, map, of, switchMap, tap } from 'rxjs';

import { AddWordComponent } from './add-word/add-word.component';
// import { WordAppService } from '../services/word.service';
import { TokenService } from '../../../auth/services/token.service';
import { WordTranslation } from '../../../core/interfaces/word-translation.interface';
import { SnackBarMessage } from '../../../core/services/error.service';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { IWordService, WordActionMode } from '../interfaces/word-service.interface';
import { Word, WordResponseDTO } from '../interfaces/word.interface';
import { WORD_SERVICE_TOKEN } from '../services/word-service.token';

// import { TableComponent } from '../../shared/components/table/table.component';

// export interface IWordTableData extends BaseWordDto<BaseTranslation>, Identifiable {
//   translateValues: string[];
// }
/** Required - because id field is required */
export interface WordTableData extends Omit<WordResponseDTO, 'id'>, Required<Pick<WordResponseDTO, 'id'>> {
  translateValues: string[];
}

export interface OpenDialogWordData {
  data: Word;
  mode: WordActionMode;
}

class WordTranslationClass {
  constructor(
    public text: string = '',
    public language: ELangs = ELangs.EN,
    public description: string = '',
    public difficultyLevel: ELevels = ELevels.Empty,
    public lexicalCategory: ELexicalCategory = ELexicalCategory.Empty,
  ) {}

  static getDefault(): WordTranslation {
    return new WordTranslationClass();
  }
}
class WordClass implements Word {
  constructor(
    public id: string = '',
    public language: ELangs = ELangs.EN,
    public owner: string = '',
    public isPublic: boolean = false,
    public text: string = '',
    public relatedForms: string[] = [],
    public translations: WordTranslation[] = [WordTranslationClass.getDefault()],
    public createdAt: Date = new Date(),
    public sentences: string[] = [],
  ) {}

  static getDefault(): WordClass {
    return new WordClass();
  }
}

@Component({
  selector: 'app-words',
  standalone: true,
  imports: [
    MatLabel,
    MatCard,
    MatCardHeader,
    MatIcon,
    MatFormField,
    MatCardContent,
    TableComponent,
    JsonPipe,
    MatInput,
    MatButton,
    MatIconButton,
    NgForOf,
    NgIf,
  ],
  templateUrl: './words.component.html',
  styleUrl: './words.component.scss',
  // providers: [WordAppService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordsComponent implements OnInit, AfterViewInit {
  // private wordService = inject(WORD_SERVICE_TOKEN);
  // @Inject(WORD_SERVICE_TOKEN) private wordService: IWordService

  readonly dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);

  checkToggle() {
    this.isShowSelection = !this.isShowSelection;
  }

  isShowSelection: boolean = false;
  displayedColumns: string[] = ['text', 'language', 'translateValues', 'voice', 'actions'];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('expandTemplate', { static: false }) expandTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('text', { static: false }) textTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('translateValues', { static: false }) translateValuesTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('voice', { static: false }) voiceTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('actions', { static: false }) actionsTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayedTemplates: { [key: string]: TemplateRef<any> } = {};

  // columnsToDisplayWithExpand = ['select',...this.displayedColumns, 'expand'];
  columnsToDisplayWithExpand = [...this.displayedColumns];
  expandedElement!: WordTableData | null;
  // expandedElement!: WordResponseDTO | null;

  dataWordSource = new MatTableDataSource<WordTableData>([]);
  // dataWordSource = new MatTableDataSource<WordResponseDTO>([]);

  selection: WritableSignal<SelectionModel<WordTableData>> = signal(new SelectionModel<WordTableData>(true, []));
  // selection: WritableSignal<SelectionModel<WordResponseDTO>> = signal(new SelectionModel<WordResponseDTO>(true, []));
  tableData: WritableSignal<WordTableData[]> = signal([]);
  // tableData: WritableSignal<WordResponseDTO[]> = signal([]);

  userInfo: unknown;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataWordSource.filterPredicate = (data: WordTableData, filter: string): boolean => {
      // this.dataWordSource.filterPredicate = (data: WordResponseDTO, filter: string): boolean => {
      const searchTerms = filter.split(' ');
      return searchTerms.every((term) => {
        return (
          data.text.toLowerCase().includes(term) ||
          data.translations.some((item) =>
            // item.translatedText.toLowerCase().includes(term) ||
            item.description?.includes(term),
          )
        );
      });
    };
    this.dataWordSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    @Inject(WORD_SERVICE_TOKEN) private wordService: IWordService,
    private tokenService: TokenService,
  ) {
    effect(() => {
      console.log('PARENT EFFECT');
      console.log('Текущее состояние выбора в родителе:', this.selection().selected);
    });

    this.tokenService.getUserDataFromToken().subscribe((res) => {
      this.userInfo = res;
    });
  }

  ngOnInit() {
    this.getData();
  }
  ngAfterViewInit() {
    this.displayedTemplates = {
      text: this.textTemplate,
      translateValues: this.translateValuesTemplate,
      voice: this.voiceTemplate,
      actions: this.actionsTemplate,
    };
  }

  private getData() {
    this.wordService
      .getWords()
      .pipe(
        delay(1000),
        tap((res) => {
          console.log(res);
        }),
        switchMap((d) => of(d.data)),
        map((data) => {
          // const dataTranslText: string[] =
          return data.map((wordObj) => {
            const translationsArr = wordObj.translations.map((wordTranslations) => wordTranslations.text);
            return <WordTableData>{ ...wordObj, translateValues: translationsArr };
          });
        }),
      )
      .subscribe((data) => {
        this.tableData.set(data);
      });
  }

  getVoice(event: MouseEvent) {
    event.stopPropagation();
  }

  addWord() {
    // const dialogRef = this.dialog.open(AddWordComponent);
    const defData = WordClass.getDefault();
    const dialogRef = this.dialog.open<AddWordComponent, OpenDialogWordData, boolean>(AddWordComponent, {
      data: { data: defData, mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Диалог закрылся с результатом:', result);
        this._snackBar.openFromComponent<unknown, SnackBarMessage>(SnackBarComponent, {
          duration: 10000,
          data: { type: 'success', message: 'Слово успешно добавлено!' },
        });
        this.reloadWords();
      }
    });
  }

  reloadWords() {
    this.getData();
  }

  // showMessage() {
  //   this._snackBar.openFromComponent<unknown, SnackBarMessage>(SnackBarComponent, {
  //     duration: 60000,
  //     data: { type: 'error', message: 'Слово успешно добавлено!' },
  //     verticalPosition: 'top',
  //     // panelClass: 'custom-snackbar-container', // Optional class for styling
  //     panelClass: ['error222-snackbar-container'],
  //   });
  // }

  editWord(event: Event, data: Word) {
    event.stopPropagation();
    console.log('edit', data);
    const dialogRef = this.dialog.open<AddWordComponent, OpenDialogWordData, boolean>(AddWordComponent, {
      data: { data: data, mode: 'edit' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Диалог закрылся с результатом:', result);
        this.reloadWords();
      }
    });
  }
}
