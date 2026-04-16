import { SessionFacade } from '@entities/session';
import { UserApiService, UserDto } from '@entities/user';
import { OfflineStorageService } from '@shared/api';
import { Syncable, SyncEventsService, SyncManagerService } from '@shared/api/sync';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ApiErrorInterface, CustomHttpErrorResponse } from '@shared/errors';

import { firstValueFrom } from 'rxjs';

export class UserSyncService implements Syncable {
  public readonly priority = 100; // Самый высокий приоритет (настройки важны для всего UI)

  constructor(
    private syncManager: SyncManagerService,
    private offlineStorage: OfflineStorageService,
    private userApiService: UserApiService,
    private syncEvents: SyncEventsService,
    private session: SessionFacade,
  ) {
    this.syncManager.register(this); // Регистрируем в менеджере при создании сервиса
  }

  public async sync(): Promise<void> {
    const ownerId = this.session.getOwnerId();
    if (!ownerId || ownerId === 'guest') return; // Гостей не синхронизируем с сервером

    const unsynced = await this.offlineStorage.getUnsyncedForActor<UserDto>('userProfile', ownerId);
    if (unsynced.length === 0) return;

    for (const entry of unsynced) {
      try {
        // Отправляем настройки на сервер
        await firstValueFrom(this.userApiService.updateSettings(entry.data.settings));

        await this.offlineStorage.markAsSynced('userProfile', entry.id);

        this.syncEvents.emit('user-changed');
      } catch (e: unknown | CustomHttpErrorResponse<ApiErrorInterface<unknown>>) {
        console.error(e);
        this.offlineStorage.markAsUnsynced('userProfile', entry.id);
      }
    }
  }
}
