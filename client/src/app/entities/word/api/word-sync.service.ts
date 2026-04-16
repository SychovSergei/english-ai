import { SessionFacade } from '@entities/session';
import { WordApiService, WordDto } from '@entities/word';
import { OfflineStorageService } from '@shared/api/offline/offline-storage.service';
import { Syncable, SyncEventsService, SyncManagerService } from '@shared/api/sync';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ApiErrorInterface, CustomHttpErrorResponse } from '@shared/errors';
import { LoggerService } from '@shared/lib/logger/logger.service';

import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WordSyncService implements Syncable {
  private readonly logger = inject(LoggerService).createLogger('WordSyncService');

  public priority = 10; // Приоритет синхронизации слов - высокий

  constructor(
    private readonly syncManager: SyncManagerService,
    private readonly offlineStorage: OfflineStorageService,
    private readonly wordApiService: WordApiService,
    private readonly session: SessionFacade,
    private readonly syncEvents: SyncEventsService,
  ) {
    // Регистрируем себя в менеджере при создании сервиса
    this.syncManager.register(this);
  }

  public async sync(): Promise<void> {
    this.logger.log('sync() >>>>>>>>>>>>');

    const ownerId = this.session.getOwnerId();
    if (!ownerId) return;

    // 1. Сначала обрабатываем удаления (важно делать это до обновлений)
    const pendingDeletion = await this.offlineStorage.getDeleted<WordDto>('words', ownerId);

    for (const entry of pendingDeletion) {
      try {
        this.logger.log('DELETE process for word = ', entry.data.value);
        await firstValueFrom(this.wordApiService.delete(entry.id));

        // ТОЛЬКО ПОСЛЕ подтверждения от сервера удаляем окончательно из IndexedDB
        await this.offlineStorage.permanentlyDelete('words', entry.id);
      } catch (e: unknown | HttpErrorResponse) {
        this.logger.error(`Error deletion ${entry.id}`, e);
        // Если слова уже нет на сервере / 404, то просто удаляем из IndexedDB
        if ((e as HttpErrorResponse).status === 404) {
          await this.offlineStorage.permanentlyDelete('words', entry.id);
        }
      }
    }

    const unsynced = await this.offlineStorage.getUnsyncedForActor<WordDto>('words', ownerId);
    // console.log('unsynced', unsynced);

    if (unsynced.length === 0) return;

    this.logger.log(`Found ${unsynced.length} unsynced words for user ${ownerId}`);

    for (const entry of unsynced) {
      try {
        this.logger.log('UPDATE process for entry = ', entry.data);
        const res = await firstValueFrom(this.wordApiService.update(entry.data));
        await this.offlineStorage.markAsSynced('words', res.id);

        this.syncEvents.emit('words-changed');
      } catch (e: unknown | CustomHttpErrorResponse<ApiErrorInterface<unknown>>) {
        this.logger.error(`Error syncing ${entry.id}`, e);
        if (e instanceof CustomHttpErrorResponse) {
          this.logger.log('e.status', e.status);
          this.logger.log('e.error', e.error);
          if (e.status === 404) {
            this.logger.log(
              'Если такого слова не существует, то мы не можем обновить -> НАДО СОЗДАВАТЬ через запрос CREATE',
              e.status,
            );
            const res = await firstValueFrom(this.wordApiService.create(entry.data));
            await this.offlineStorage.markAsSynced('words', res.id);

            this.syncEvents.emit('words-changed');
          }
        } else {
          this.logger.log('e', e);
        }
        // Здесь можно добавить проверку на 401: если токен протух,
        // прерываем цикл синхронизации
        break;
      }
    }
  }
}
