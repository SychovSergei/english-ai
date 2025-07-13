import { AddWordDialogComponent } from '@features/words/add-word-dialog';
import { OpenDialogWordData } from '@features/words/types/open-dialog-word-data';
import { ITableActions, TableActionsModule } from '@shared/ui/data-table-actions';

import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  imports: [TableActionsModule],
})
export class WordTableActionsComponent {
  @Input() wordsList: string[] = []; // TODO ЗАЧЕМ ???

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
        data: { data: null, mode: 'create' },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          console.log('Диалог закрылся с результатом:', result); // TODO ????
          if (result.success) this.refreshTable.emit();
        }
      });
  }

  private addWordsToSet(): void {
    console.log('Button - Add words to Set');
  }
}
