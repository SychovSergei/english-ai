import { SessionFacade } from '@entities/session';
import { UserApiService, UserDto, UserEntity, UserMapper, UserSettings, UserSettingsDto } from '@entities/user';
import { ConnectivityService, OfflineEntry, OfflineStorageService } from '@shared/api';
import { LoggerService } from '@shared/lib';

import { effect, inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  private readonly userApi = inject(UserApiService);
  private readonly connectivityService = inject(ConnectivityService);
  private readonly offlineStorage = inject(OfflineStorageService);
  private readonly session = inject(SessionFacade);
  private readonly logger = inject(LoggerService).createLogger('UserFacade');

  private readonly _currentUser$ = new BehaviorSubject<UserEntity | null>(null);
  public readonly currentUser$ = this._currentUser$.asObservable();

  public readonly settings$ = this.currentUser$.pipe(
    map((user) => user?.getProps().settings ?? UserSettings.createDefault()),
  );

  constructor() {
    effect(() => {
      const owner = this.session.ownerSignal();

      if (owner) {
        this.logger.log(`Owner changed to ${owner.id}, loading profile...`);
        this.loadProfile(owner.id);
      } else {
        // Если логаут (owner === null)
        this.clearProfile();
      }
    });
  }

  private clearProfile(): void {
    this._currentUser$.next(null);
    this.offlineStorage.clear('userProfile');
  }

  async loadProfile(ownerId: string): Promise<void> {
    // const ownerId = this.session.getOwnerId();
    // if (!ownerId) return;

    // 1. Сначала берем из локальной базы (мгновенно)
    const local = await this.offlineStorage.getById<UserDto>('userProfile', 'me');
    if (local) {
      this._currentUser$.next(UserMapper.toDomain(local.data));
    }

    // 2. Если онлайн — обновляем с сервера
    if (this.connectivityService.isOnline()) {
      this.userApi.getProfile().subscribe({
        next: async (dto) => {
          console.log('PROFILE DTO from server', dto);
          const entity = UserMapper.toDomain(dto);
          this._currentUser$.next(entity);
          // Сохраняем в оффлайн
          await this.offlineStorage.save('userProfile', {
            id: 'me',
            data: dto,
            synced: true,
            isDeleted: false,
            updatedAt: Date.now(),
            ownerId: ownerId,
          });
        },
        error: (err) => {
          this.logger.error('Failed to get profile', err);
        },
      });
    }
  }

  async updateSettings(newSettings: UserSettingsDto): Promise<void> {
    const ownerId = this.session.snapshot;
    if (!ownerId) return;

    // 1. Создаем объект записи для IndexedDB
    const entry: OfflineEntry<UserDto> = {
      id: 'me',
      ownerId: ownerId.value,
      data: {
        id: ownerId.value,
        // TODO check the properties
        firstName: this._currentUser$.value?.firstName || 'empty',
        lastName: this._currentUser$.value?.getProps().lastName || 'empty',
        email: this._currentUser$.value?.getProps().email || 'empty',
        isActivated: this._currentUser$.value?.getProps().isActivated || false,
        settings: {
          ...this._currentUser$.value?.getProps().settings,
          ...newSettings,
        },
        updatedAt: Date.now(),
      },
      synced: false,
      isDeleted: false,
      updatedAt: Date.now(),
    };

    // 2. Сохраняем в оффлайн
    await this.offlineStorage.save('userProfile', entry);

    // 3. Обновляем в UI
    this._currentUser$.next(UserMapper.toDomain(entry.data));

    // Оптимистичное обновление UI...
    // Вызов SyncManager для отправки на сервер...
  }
}
