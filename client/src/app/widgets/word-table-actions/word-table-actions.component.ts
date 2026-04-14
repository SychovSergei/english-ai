import { AddWordDialogComponent, OpenDialogWordData } from '@features/words';
import { LoggerService } from '@shared/lib/logger/logger.service';
import { ITableActions, TableActionsComponent } from '@shared/ui';

import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

// const EMPTY_TRANSLATION: WordTranslation = {
//   id: '',
//   language: ELangs.EN, //TODO config???
//   text: '',
//   description: '',
//   difficultyLevel: ELevels.Empty,
//   lexicalCategory: ELexicalCategory.Empty,
// };
// const EMPTY_WORD: Word = {
//   id: '',
//   language: ELangs.EN, //TODO config???
//   owner: '',
//   text: '',
//   translations: [EMPTY_TRANSLATION],
// };

@Component({
  selector: 'app-words-data-table-actions',
  templateUrl: 'word-table-actions.component.html',
  styleUrls: ['./word-table-actions.component.scss'],
  standalone: true,
  imports: [TableActionsComponent],
})
export class WordTableActionsComponent {
  // TODO INFO: использую для определения кнопок в Word таблице

  private readonly loggerService = inject(LoggerService).createLogger('WordTableActionsComponent');

  // @Input() wordsList: string[] = []; // TODO ЗАЧЕМ ???

  @Output() refreshTable = new EventEmitter<void>();

  // readonly dialog = inject(MatDialog);
  constructor(public dialog: MatDialog) {}

  actions: ITableActions[] = [
    {
      id: 1,
      label: 'Add',
      iconType: 'mat',
      icon: 'add_circle_outline',
      cbFunction: (): void => {
        return this.addWordDialog();
      },
    },
    {
      id: 2,
      label: 'Add words to Set',
      iconType: 'mat',
      icon: 'add_circle_outline',
      cbFunction: (): void => {
        return this.addWordsToSet();
      },
    },
  ];

  private addWordDialog(): void {
    this.dialog
      .open<AddWordDialogComponent, OpenDialogWordData, { success: boolean }>(AddWordDialogComponent, {
        data: { mode: 'create', data: null },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loggerService.log('Диалог закрылся с результатом:', result); // TODO ????
          if (result.success) this.refreshTable.emit();
        }
      });
  }

  private addWordsToSet(): void {
    this.loggerService.log('Button - Add words to Set');
  }
}
