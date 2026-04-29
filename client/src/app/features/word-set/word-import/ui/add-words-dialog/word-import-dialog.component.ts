import { WordItem } from '@entities/word-set';
import { FloatButtonModule } from '@shared/directives/add-floating-button';
import { generateCompactId } from '@shared/lib';
import { LoggerService } from '@shared/lib/logger/logger.service';
import { DialogComponent } from '@shared/ui';
import { UiKitModule } from '@shared/ui/ui-kit';

import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { SimpleWordListComponent } from '../simple-word-list';

interface ListFormControl {
  wordList: FormControl<string | null>;
}

@Component({
  selector: 'app-word-import',
  templateUrl: './word-import-dialog.component.html',
  styleUrls: ['./word-import-dialog.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CdkTextareaAutosize,
    JsonPipe,
    CdkDrag,
    CdkDragHandle,
    UiKitModule,
    NgForOf,
    NgIf,

    DialogComponent,
    FloatButtonModule,
    SimpleWordListComponent,
  ],
})
export class WordImportDialogComponent implements OnInit {
  private readonly loggerService = inject(LoggerService).createLogger('WordImportDialogComponent');

  /** TODO Отвечает за импорт слов —
   *    открывает диалог, обрабатывает импорт и добавляет слова.
   */

  title: string = 'Import Words';
  wordImportForm: FormGroup<ListFormControl>;

  constructor(
    // @Inject(MAT_DIALOG_DATA) private data: OpenDialogWordData,
    private dialogRef: MatDialogRef<WordImportDialogComponent>,
    private fb: FormBuilder,
  ) {
    this.wordImportForm = this.fb.group<ListFormControl>({
      wordList: this.fb.control<string | null>(''),
    });
  }

  resultWordArray: WordItem[] = [];

  ngOnInit(): void {
    this.wordImportForm.controls['wordList'].valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.loggerService.log('<<<<<<<<');
        this.loggerService.log('value', value);
        this.resultWordArray = this.createList(this.formatText(value || ''));
        this.loggerService.log('>>>>>>>>');
        // this.cdr.detectChanges();
      });

    this.wordImportForm.controls['wordList'].setValue(
      'traitor зрадник \n consistent послідовний  \nepisode епізод \n',
      { emitEvent: true },
    );
  }

  private createList(list: string[][]): WordItem[] {
    const arr: WordItem[] = [];
    for (const listItem of list) {
      arr.push(this.createItem(listItem));
    }
    return arr;
  }

  private createItem(line: string[]): WordItem {
    return {
      id: generateCompactId(),
      term: line[0],
      definition: line[1],
    };
  }

  private formatText(text: string): string[][] {
    const betweenLines = '\n';
    const betweenCards = ' ';

    return text
      .split(betweenLines)
      .filter((line) => line.trim().length > 0)
      .map((line) =>
        line
          .trim()
          .split(betweenCards)
          .filter((item) => item.trim().length > 0),
      )
      .map((item) => {
        const [res, ...rest] = item;
        return [res || 'empty', rest.join(' ')];
      });
  }

  closeDialog(): void {
    console.log('closeDialog');
    // { success: 'status' }
    this.dialogRef.close(); // Передаем данные при
  }

  importData(): void {
    console.log('importData');
    this.dialogRef.close(this.resultWordArray);
  }
}

// prevValueList: InitialData[] = [];
// currValueList: InitialData[] = [];

// this.wordImportForm.controls['wordList'].valueChanges
//   .pipe(
//     debounceTime(1000),
//     distinctUntilChanged(),
//     startWith(this.wordImportForm.controls['wordList'].value), // <- это добавит первое значение,
//     pairwise(),
//   )
//   .subscribe(([prevValue, currValue]) => {
//     console.log('<<<<<<<<');
//     console.log(prevValue);
//     console.log(currValue);
//     // const prevValueList = this.createList(this.formatText(prevValue || ''));
//     // const currValueList = this.createList(this.formatText(currValue || ''));
//     if (prevValue === null || currValue === null) return;
//     if (currValue === '' || prevValue === '') {
//       console.log('ПУСТОЕ', 'prevValue =', prevValue, 'currValue =', currValue);
//       [this.prevValueList, this.currValueList] = this.createLists(
//         this.formatText(prevValue),
//         this.formatText(currValue),
//       );
//     } else {
//       console.log('НЕ ПУСТОЕ');
//       this.prevValueList = this.createList(this.formatText(prevValue || '00003'));
//       this.currValueList = this.createList(this.formatText(currValue || '00004'));
//       // this.updateList(prevValueList, this.currValueList);
//     }
//
//     console.log(this.prevValueList);
//     console.log(this.currValueList);
//
//     console.log('>>>>>>>>');
//     this.resultWordArray = this.currValueList;
//     this.cdr.detectChanges();
//   });

// compareLists(prevList: InitialData[], currList: InitialData[]): void {
//   const currSourceArray = prevList > currList ? prevList : currList;
//   for (const [index, initialItem] of currSourceArray.entries()) {
//     initialItem
//   }
// }

// updateList(prevListObj: InitialData[], currListObj: InitialData[]): InitialData[] {
//   // const currSourceArray = prevListObj > currListObj ? prevListObj : currListObj;
//   for (const [index, initialItemLine] of currListObj.entries()) {
//     if (
//       initialItemLine.term === prevListObj[index].term &&
//       initialItemLine.definition === prevListObj[index].definition
//     ) {
//       currListObj[index].id = prevListObj[index].id;
//     } else {
//       currListObj[index].id = generateUuid();
//     }
//   }
//   return currListObj;
// }

// createLists(prevListStr: string[][], currListStr: string[][]): InitialData[][] {
//   // const currSourceArray = prevListStr > currListStr ? prevListStr : currListStr;
//   const prevListObj = this.createList(prevListStr);
//   const currListObj = this.createList(currListStr);
//   console.log('prevListObj', prevListObj);
//   console.log('currListObj', currListObj);
//   for (const [index, initialItemLine] of currListObj.entries()) {
//     if (
//       prevListObj[index] &&
//       initialItemLine.term === prevListObj[index].term &&
//       initialItemLine.definition === prevListObj[index].definition
//     ) {
//       prevListObj[index].id = initialItemLine.id;
//     }
//   }
//
//   return [prevListObj, currListObj];
// }
