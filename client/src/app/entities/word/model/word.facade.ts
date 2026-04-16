import { SessionFacade } from '@entities/session';
import {
  CheckWordExistsResponseDto,
  CreateWordPayload,
  UpdateWordPayload,
  WordApiService,
  WordDto,
  WordEntity,
  WordId,
  WordMapper,
} from '@entities/word';
import { ConnectivityService, NotificationService } from '@shared/api';
import { OfflineEntry, OfflineStorageService } from '@shared/api/offline';
import { SyncEventsService, SyncManagerService } from '@shared/api/sync';
import { ELangs } from '@shared/enums';
import { OwnerId } from '@shared/lib/auth';
import { LoggerService } from '@shared/lib/logger';

import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  combineLatest,
  concat,
  distinctUntilChanged,
  filter,
  from,
  map,
  Observable,
  of,
  scan,
  tap,
} from 'rxjs';
import { catchError } from 'rxjs/operators';

// import { CheckWordExistsResponseDto, CreateWordPayload, UpdateWordPayload, WordDto } from '../api/dtos/word.dto';

@Injectable({ providedIn: 'root' })
export class WordFacade {
  private destroyRef = inject(DestroyRef);
  private readonly logger = inject(LoggerService).createLogger('WordFacade');

  private readonly _words$ = new BehaviorSubject<WordEntity[]>([]);
  private readonly _filter$ = new BehaviorSubject<{ search: string; lang: ELangs | null }>({
    search: '',
    lang: null,
  });

  public readonly words$ = this._words$.asObservable();
  public readonly filteredWords$ = combineLatest([this._words$, this._filter$]).pipe(
    map(([words, filter]) => {
      return words.filter((word) => {
        const matchedSearch = word.value.value.toLowerCase().includes(filter.search);
        const matchesLang = !filter.lang || word.getProps().language === filter.lang;
        return matchedSearch && matchesLang;
      });
    }),
  );

  public setFilter(search: string, lang: ELangs | null): void {
    this._filter$.next({ search, lang });
  }

  public readonly wordsCount$ = this.words$.pipe(map((words) => words.length));

  constructor(
    private readonly connectivity: ConnectivityService,
    private readonly wordApiService: WordApiService,
    private readonly offlineStorageService: OfflineStorageService, // indexedDB
    private readonly syncManager: SyncManagerService,
    private readonly session: SessionFacade,
    private readonly syncEvents: SyncEventsService,
    private readonly notificationService: NotificationService,
  ) {
    // Автоматическая очистка при logout
    this.session.currentOwner$.pipe(filter((owner) => owner === null)).subscribe(() => {
      this.clearState();
    });

    this.setupSyncListeners();
    this.setupOwnerListeners();
  }

  public async loadAll(ownerId?: OwnerId): Promise<void> {
    const owner = this.session.snapshot;
    const ownerIdValue = ownerId?.value ?? owner?.value;
    if (!ownerIdValue) return;
    if (!owner) return;

    const offlineEntries = await this.offlineStorageService.getByOwner<WordDto>('words', ownerIdValue);
    const domainOfflineWordEntities = offlineEntries.map((w) =>
      WordMapper.toDomain(
        {
          ...w.data,
          synced: w.synced, // берем изначальное актуальное значение synced из локального (потом если синхронизация прошла - обновляем)
          isDeleted: w.isDeleted, // берем изначальное актуальное значение из локального
        },
        owner,
      ),
    );

    // const offlineDeletedEntries = await this.offlineStorageService.getDeleted<WordDto>('words', ownerIdValue);
    // const offlineDeletedIds = offlineDeletedEntries
    //   .map((word) => {
    //     if (word.isDeleted) {
    //       return word.id;
    //     }
    //     return;
    //   })
    //   .filter((w) => w !== undefined);

    // Мгновенно обновляем UI локальными данными
    this.logger.warn('Мгновенно обновляем UI локальными данными...');
    this._words$.next(domainOfflineWordEntities);

    // 2. Если мы онлайн, идем за свежими данными на сервер
    this.syncManager.runSync();
  }

  public async createWord(data: CreateWordPayload): Promise<string | null> {
    // 1. Получаем ID текущего пользователя (или гостя)
    // const ownerId = this.session.getOwnerId();
    const owner = this.session.snapshot;
    if (!owner) return null;

    // TODO ?????
    //  this.offlineStorageService.checkWordExists(data.value);
    try {
      // 1. Создаем сущность (DDD Logic + Validation)
      const newWord = WordEntity.create(data, OwnerId.fromRaw({ kind: owner.kind, id: owner?.id, role: owner.role }));

      // 2. Пытаемся сохранить в Offline Storage IndexedDB
      const wordDto = WordMapper.toPersistence(newWord);
      const entry: OfflineEntry<WordDto> = {
        id: wordDto.id,
        ownerId: owner.id,
        data: wordDto,
        synced: newWord.getProps().metadata.synced ?? true,
        isDeleted: newWord.getProps().metadata.isDeleted || false,
        updatedAt: Date.now(),
      };
      const saveRes = await this.offlineStorageService.save('words', entry);

      // 4. Синхронизируем с сервером / попытка отправить на сервер
      this.logger.log('saveRes', saveRes);
      // if (saveRes && !this.connectivity.isOnline()) this.notificationService.showWarning('Слово СОХРАНЕНО ЛОКАЛЬНО.');

      // Сразу обновляем UI (оптимистично)
      this.loadAll();

      // Просим менеджер отправить это на сервер в фоне
      this.syncManager.runSync();

      return newWord.id.value;
    } catch (error: unknown | Error) {
      // Здесь мы ловим ошибки из ValueObjects или сущности Word
      this.notificationService.showError((error as Error).message);
      // throw error; // Пробрасываем ошибку в форму, если нужно подсветить поля
      return null;
    }
  }

  public async updateWord(payload: UpdateWordPayload): Promise<void> {
    try {
      const owner = this.session.snapshot;
      if (!owner) return;

      // 1. Получаем запись из IndexedDB
      // Важно: типизируем возвращаемое значение метода getById
      const offlineEntry = await this.offlineStorageService.getById<WordDto>('words', payload.id);
      if (!offlineEntry) throw new Error('Word not found in offline storage');

      // 2. Восстанавливаем сущность из DTO, который лежит в entry.data
      const entity = WordMapper.toDomain(
        {
          ...offlineEntry.data,
          synced: false, // так как обновляем данные, то слово НЕ синхронизировано
          isDeleted: false, // так как обновляем данные, то слово НЕ удалёно //offlineEntry.isDeleted,
        },
        owner,
      );

      // 3. Применяем обновления
      const updatedEntity = entity.update(payload);

      // 4. Готовим данные для сохранения
      const currentOwner = this.session.getOwnerId();
      if (!currentOwner) throw new Error('No active session');

      const updatedDto = WordMapper.toPersistence(updatedEntity);

      // 5. Сохраняем в Offline Storage
      const isUpdated = await this.offlineStorageService.update(
        'words',
        currentOwner,
        updatedEntity.id.value,
        updatedDto,
      );
      this.logger.log('isUpdated', isUpdated);

      this.loadAll();

      this.syncManager.runSync();
    } catch (error: unknown | Error) {
      this.notificationService.showError((error as Error).message || 'Ошибка при обновлении');
      throw error;
    }
  }

  /**
   * 5. Удаление (Soft Delete)
   */
  public async deleteWord(wordId: string): Promise<void> {
    console.log('Delete word', wordId);

    // Ставим флаги isDeleted: true и synced: false
    await this.offlineStorageService.markForDeletion('words', wordId);

    // Мгновенно скрываем из UI
    this.loadAll();

    // Запускаем синхронизацию удаления
    this.syncManager.runSync();
  }

  public checkWordExistence(value: string): Observable<CheckWordExistsResponseDto> {
    const normalizedValue = value.trim().toLowerCase();
    // 1. Получаем ID текущего пользователя (или гостя)
    const currentOwnerId = this.session.getOwnerId();
    if (!currentOwnerId) throw new Error('No active session');

    // 1. Сначала ищем локально (мгновенно)
    const localSearch$ = from(
      this.offlineStorageService.findAllByValue<WordDto>('words', currentOwnerId, normalizedValue),
    ).pipe(
      tap((res) => {
        console.log('localSearch$ res ===', res);
      }),
      map((entries) => ({
        value,
        exists: entries.length > 0,
        variants: entries.map((w) => ({
          id: w.data.id,
          sense: w.data.sense,
          translations: w.data.translations.map((t) => t.value),
        })),
      })),
    );

    // 2. Если мы онлайн — идем на сервер
    if (this.connectivity.isOnline()) {
      // TODO
      const remoteSearch$ = this.wordApiService
        .checkWordExists({ word: value, lang: ELangs.EN })
        .pipe(catchError(() => of(null)));

      // Объединяем: выдаем локальные сразу, потом заменяем серверными (они точнее)
      return concat(localSearch$, remoteSearch$.pipe(filter((v): v is CheckWordExistsResponseDto => v !== null))).pipe(
        // Группируем омонимы (локальные + серверные), убирая дубли по ID
        scan((acc, curr) => {
          const allVariants = [...acc.variants, ...curr.variants];
          // console.log('allVariants ====', allVariants);
          const uniqueVariants = Array.from(new Map(allVariants.map((v) => [v.id, v])).values());
          // console.log('uniqueVariants ====', uniqueVariants);

          return { ...curr, variants: uniqueVariants, exists: uniqueVariants.length > 0 };
        }),
      );
    }

    return localSearch$;
  }

  public getEntityById(id: string): WordEntity | undefined {
    const currentOwner = this.session.getOwnerId();
    if (!currentOwner) throw new Error('No active session');

    const word = this._words$.getValue().find((w) => w.id.value === id);

    return word;
  }

  public getWordFromStorageById(id: string): Observable<WordDto> {
    const currentOwner = this.session.getOwnerId();
    if (!currentOwner) throw new Error('No active session');

    const localSearch$: Observable<WordDto> = from(this.offlineStorageService.getById<WordDto>('words', id)).pipe(
      tap((res) => {
        console.log('localSearch$ res ===', res);
      }),
      filter((val) => {
        return val !== undefined; // TODO check condition
      }),
      map((entries) => ({
        id: entries.data.id,

        value: entries.data.value,
        language: entries.data.language,
        ownerId: entries.data.ownerId,
        isPublic: entries.data.isPublic,
        sense: entries.data.sense,
        image: entries.data.image,
        translations: entries.data.translations,
      })),
    );

    // TODO implement getting word from server ?????

    return localSearch$;
  }

  public replaceInState(id: WordId, word: WordEntity): void {
    const updatedWords = this._words$.value.map((w) => {
      // обновляем только те слова, которые совпадают по id, остальные оставляем
      return w.id.value === id.value ? word : w;
    });

    this._words$.next(updatedWords);
  }

  private clearState(): void {
    this._words$.next([]);
  }

  /**
   * 1. Слушаем сигналы от синхронизатора
   */
  private setupSyncListeners(): void {
    this.syncEvents.events$
      .pipe(
        filter((event) => event === 'words-changed'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.logger.log('Sync event received,, reloading data...');
        this.loadAll();
      });
  }
  /**
   * 2. Слушаем смену пользователя
   */
  private setupOwnerListeners(): void {
    this.session.currentOwner$
      .pipe(
        filter((owner): owner is OwnerId => owner !== null), // Ждем только реального юзера
        distinctUntilChanged((prev, curr) => prev.value === curr.value), // Чтобы не грузить дважды одно и то же
      )
      .subscribe((owner) => {
        this.logger.log('Owner detected, loading data...', owner.value);
        this.loadAll(owner); // Вызываем загрузку для конкретного владельца
      });
  }
}
