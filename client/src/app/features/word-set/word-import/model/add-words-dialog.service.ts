import { WordItem, WordItemIsNew } from '@entities/word-set';
import { mapToWordItemIsNew } from '@features/word-set/word-import/libs';
import { WordImportDialogComponent } from '@features/word-set/word-import/ui';

import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddWordsDialogService {
  readonly dialog = inject(MatDialog);

  constructor() {}

  open(): Observable<WordItemIsNew[] | undefined> {
    console.log('service openImportDialog');
    const dialogRef = this.dialog.open(WordImportDialogComponent, {
      panelClass: 'fullscreen-dialog',
      maxWidth: '100vw',
    });

    return dialogRef.afterClosed().pipe(
      map((result: WordItem[] | undefined) => {
        if (!result) return undefined;
        return mapToWordItemIsNew(result);
      }),
    );
  }
}
