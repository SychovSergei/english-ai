import { UpdateWordPayload, WordFacade, WordMapper } from '@entities/word';
import { AddWordDialogComponent, OpenDialogWordData, WordFormMapper } from '@features/words';
import { LoggerService } from '@shared/lib/logger/logger.service';

import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class WordActionsService {
  private readonly dialog = inject(MatDialog);
  private readonly wordFacade = inject(WordFacade);
  private readonly loggerService = inject(LoggerService).createLogger('WordActionsService');

  constructor() {}

  /**
   * Оркестрация редактирования:
   * 1. Получаем данные
   * 2. Открываем UI
   * 3. Передаем результат в Facade
   */
  public async editWord(wordId: string): Promise<void> {
    // Получаем текущее состояние из фасада (он уже хранит загруженные слова)
    const entity = this.wordFacade.getEntityById(wordId);
    if (!entity) return;

    // Мапим Entity -> FormValue (ViewModel для диалога)
    const dataForForm = WordFormMapper.toForm(WordMapper.toPersistence(entity));

    const dialogRef = this.dialog.open<
      AddWordDialogComponent,
      OpenDialogWordData,
      { success: boolean; payload?: UpdateWordPayload }
    >(AddWordDialogComponent, {
      data: { mode: 'edit', data: dataForForm },
    });

    dialogRef.afterClosed().subscribe((result: { success: boolean; payload?: UpdateWordPayload } | undefined) => {
      this.loggerService.warn('afterClosed', result?.success);
      if (result?.success) {
        // TODO обновить список или логирование...
        this.loggerService.log('Диалог EDIT button закрылся:', result);
        this.wordFacade.loadAll();
      }
      // Важно: Диалог может сам вызвать facade.updateWord,
      // либо вернуть payload сюда, чтобы сервис вызвал фасад.
      // В Offline-first лучше, чтобы диалог вызывал фасад напрямую для скорости,
      // а сервис просто следил за открытием/закрытием.
    });
  }

  public async createWord(): Promise<void> {
    this.dialog.open(AddWordDialogComponent, {
      data: { mode: 'create', data: null },
    });
  }
}
