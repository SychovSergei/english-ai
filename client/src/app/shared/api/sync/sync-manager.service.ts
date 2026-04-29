import { ConnectivityService } from '@shared/api/connectivity.service';
import { AuthStatusProvider } from '@shared/lib/auth/auth-status.provider';
import { LoggerService } from '@shared/lib/logger/logger.service';

import { effect, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

export interface Syncable {
  sync: () => Promise<void>;
  priority: number; // Например, сначала Words, потом WordSets
}

@Injectable({ providedIn: 'root' })
export class SyncManagerService {
  private isSyncing = false; // Флаг блокировки
  private syncRegistry = new Set<Syncable>();

  private connectivity = inject(ConnectivityService);
  private authProvider = inject(AuthStatusProvider); // Это SessionFacade через DI
  private logger = inject(LoggerService).createLogger('SyncManagerService');

  /** ***** private syncTasks: Array<() => Promise<void>> = [];*/

  constructor() {
    const owner = toSignal(this.authProvider.currentOwner$);

    effect(() => {
      const isOnline = this.connectivity.isOnline();
      const currentOwner = owner();

      this.logger.log(`Sync Watcher: online=${isOnline}, auth=${currentOwner?.kind}`);

      if (isOnline && currentOwner?.kind === 'user') this.runSync();
    });
  }

  /**
   * Регистрация задачи синхронизации от разных сущностей (Words, WordSets)
   */
  register(service: Syncable): void {
    this.syncRegistry.add(service);
  }

  /**
   * Запуск всех зарегистрированных задач
   */
  async runSync(): Promise<void> {
    if (this.isSyncing) {
      this.logger.log('Sync already in progress, skipping...');
      return;
    }

    // && this.authProvider.isAuthenticated()
    const canSync = this.connectivity.isOnline() && this.syncRegistry.size > 0;
    this.logger.log(
      `runSync ${this.connectivity.isOnline()} ${this.authProvider.isAuthenticated()} ${this.syncRegistry.size}` +
        ` = canSync ${canSync}`,
    );
    if (!canSync) return;

    try {
      this.isSyncing = true;
      const tasks = Array.from(this.syncRegistry).sort((a, b) => b.priority - a.priority);

      this.logger.log('🚀 Starting synchronization...');

      for (const service of tasks) {
        if (!this.authProvider.isAuthenticated()) break;

        // Сервис сам заглянет в IndexedDB и отправит то, что нужно
        await service.sync();
      }
    } catch (e) {
      this.logger.error(`Task failed`, e);
    } finally {
      this.isSyncing = false; // Снимаем блокировку в любом случае (успех или ошибка)
      this.logger.log('🏁 Synchronization finished.');
    }
  }
}
