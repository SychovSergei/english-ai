import { SelectionModel } from '@angular/cdk/collections';
import { JsonPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';

import { delay, map, of, switchMap } from 'rxjs';

import { IWord } from '../../core/models/dtos/word.dto';
import { WordService } from '../../core/services/word.service';
import { TableComponent } from '../../shared/components/table/table.component';

export interface IWordTableData extends IWord {
  translateValues: string[];
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
  ],
  templateUrl: './words.component.html',
  styleUrl: './words.component.scss',
  providers: [WordService],
})
export class WordsComponent implements OnInit, AfterViewInit {
  checkToggle() {
    this.isShowSelection = !this.isShowSelection;
  }

  isShowSelection: boolean = false;
  displayedColumns: string[] = ['originalText', 'language', 'translateValues', 'voice', 'actions'];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('expandTemplate', { static: false }) expandTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('originalText', { static: false }) originalTextTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('translateValues', { static: false }) translateValuesTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('voice', { static: false }) voiceTemplate!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayedTemplates: { [key: string]: TemplateRef<any> } = {};

  // columnsToDisplayWithExpand = ['select',...this.displayedColumns, 'expand'];
  columnsToDisplayWithExpand = [...this.displayedColumns];
  expandedElement!: IWordTableData | null;

  dataWordSource = new MatTableDataSource<IWordTableData>([]);
  // selection = new SelectionModel<IWordTableData>(true, []);
  selection: WritableSignal<SelectionModel<IWordTableData>> = signal(new SelectionModel<IWordTableData>(true, []));
  tableData: WritableSignal<IWordTableData[]> = signal([]);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataWordSource.filterPredicate = (data: IWordTableData, filter: string): boolean => {
      const searchTerms = filter.split(' ');
      return searchTerms.every((term) => {
        return (
          data.originalText.toLowerCase().includes(term) ||
          data.translations.some((item) =>
            // item.translatedText.toLowerCase().includes(term) ||
            item.description?.includes(term),
          )
        );
      });
    };
    this.dataWordSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private wordService: WordService) {
    effect(() => {
      console.log('PARENT EFFECT');
      console.log('Текущее состояние выбора в родителе:', this.selection().selected);
    });
  }

  ngOnInit() {
    this.getData();
  }
  ngAfterViewInit() {
    this.displayedTemplates = {
      originalText: this.originalTextTemplate,
      translateValues: this.translateValuesTemplate,
      voice: this.voiceTemplate,
    };
  }

  private getData() {
    this.wordService
      .getAll()
      .pipe(
        delay(2000),
        switchMap((d) => of(d.data)),
        map((data) => {
          // const dataTranslText: string[] =
          return data.map((wordObj) => {
            const translationsArr = wordObj.translations.map((wordTranslations) => wordTranslations.translatedText);
            return <IWordTableData>{ ...wordObj, translateValues: translationsArr };
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
}
