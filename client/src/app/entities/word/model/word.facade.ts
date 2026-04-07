import { SessionFacade } from '@entities/session/model/session.facade';
import { WordApiService, WordSyncService } from '@entities/word/api';
import { CheckWordExistsResponseDto, CreateWordPayload, UpdateWordPayload, WordDto } from '@entities/word/api/word.dto';
import { WordMapper } from '@entities/word/libs/word.mapper';
import { WordEntity, WordId } from '@entities/word/model';
import { NotificationService } from '@shared/api';
import { ConnectivityService } from '@shared/api/connectivity.service';
import { OfflineEntry, OfflineStorageService } from '@shared/api/offline/offline-storage.service';
import { SyncManagerService } from '@shared/api/sync/sync-manager.service';
import { ELangs } from '@shared/enums';
import { OwnerId } from '@shared/lib/auth/owner-id.vo';
import { LoggerService } from '@shared/lib/logger/logger.service';

import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  combineLatest,
  concat,
  delay,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  from,
  map,
  Observable,
  of,
  scan,
  tap,
} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SyncEventsService } from '@shared/api/sync/sync-events.service';

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
    // private readonly dialog: MatDialog,
    private readonly wordApiService: WordApiService,
    private readonly offlineStorageService: OfflineStorageService, // indexedDB
    private readonly notificationService: NotificationService,
    private readonly connectivity: ConnectivityService,
    private readonly syncManager: SyncManagerService,
    private readonly wordSyncService: WordSyncService,
    private readonly session: SessionFacade,
    private readonly syncEvents: SyncEventsService,
  ) {
    // Регистрируем задачу синхронизации при инициализации фасада
    // this.syncManager.registerSyncTask(() => this.syncUnsyncedWords());
    // TODO OR???
    //  this.syncManager.register(this.wordSyncService);

    // Автоматическая очистка при logout
    this.session.currentOwner$.pipe(filter((owner) => owner === null)).subscribe(() => {
      this.clearState();
    });
    // Автоматическая очистка при logout

    this.setupSyncListeners();
    this.setupOwnerListeners();
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

  // async getUnsynced(): Promise<OfflineEntry<WordDto>[]> {
  //   const owner = this.session.getSnapshot();
  //   console.log('ownerId', owner?.value);
  //   if (!owner?.value) return [];
  //
  //   const offlineEntries = await this.offlineStorageService.getUnsynced<WordDto>('words', owner.value);
  //   return offlineEntries || [];
  // }

  public async loadAll(ownerId?: OwnerId): Promise<void> {
    const owner = this.session.snapshot;
    this.logger.log('loadAll() ownerId', ownerId?.value, owner?.value);
    // if (!ownerId?.value) return;
    // if (!owner?.value) return;

    const ownerIdValue = ownerId?.value ?? owner?.value;
    if (!ownerIdValue) return;
    console.log(ownerIdValue);

    const offlineEntries = await this.offlineStorageService.getByOwner<WordDto>('words', ownerIdValue);
    console.log('>>>>> offlineEntries ====', offlineEntries);
    const domainOfflineWordEntities = offlineEntries.map((w) =>
      WordMapper.toDomain({
        ...w.data,
        synced: w.synced, // берем изначальное актуальное значение synced из локального (потом если синхронизация прошла - обновляем)
        isDeleted: w.isDeleted, // берем изначальное актуальное значение из локального
      }),
    );
    //.map((dto) => WordMapper.toDomain({ ...dto }));

    const offlineDeletedEntries = await this.offlineStorageService.getDeleted<WordDto>('words', ownerIdValue);

    const offlineDeletedIds = offlineDeletedEntries
      .map((word) => {
        if (word.isDeleted) {
          return word.id;
        }
        return;
      })
      .filter((w) => w !== undefined);

    console.log(
      'domainOfflineWordEntities metadata::',
      domainOfflineWordEntities.map((w) => w.getProps().metadata),
    );
    // Мгновенно обновляем UI локальными данными
    this.logger.warn('Мгновенно обновляем UI локальными данными...');
    this._words$.next(domainOfflineWordEntities);

    // 2. Если мы онлайн, идем за свежими данными на сервер
    if (this.connectivity.isOnline()) {
      this.syncManager.runSync();
      /**   this.logger.log('Online, fetching FRESH data...');
      // Пытаемся синхронизировать с сервером
      this.wordApiService
        .getAll()
        .pipe(delay(3000), takeUntilDestroyed(this.destroyRef))
        .subscribe(async (serverDtos) => {
          // Здесь должна быть логика синхронизации (Sync Service)
          // Для примера: просто сохраняем новые данные в оффлайн как синхронизированные
          // console.log('offlineDeletedIds', offlineDeletedIds);
          // console.log('serverDtos', serverDtos, serverDtos.length);

          this.logger.warn('[WordFacade] loadAll() Сохраняем в оффлайн базу...');

          // Сохраняем в оффлайн базу
          for (const dto of serverDtos) {
            if (offlineDeletedIds.includes(dto.id)) continue;

            const entry: OfflineEntry<WordDto> = {
              id: dto.id,
              ownerId: dto.ownerId || ownerIdValue,
              data: dto,

              synced: true,
              isDeleted: false,
              updatedAt: dto.updatedAt ?? Date.now(),
            };

            // await this.offlineStorageService.save('words', ownerId.value || owner.value, dto.id, dto);
            await this.offlineStorageService.save('words', entry);
            const num = await this.offlineStorageService.updateSyncStatus('words', dto.id, dto, true);
          }

          // Обновляем UI финальными данными с сервера
          // предварительно фильтруем удаленные записи
          const updatedWords = serverDtos
            .filter((w) => !offlineDeletedIds.includes(w.id))
            .map((w) =>
              WordMapper.toDomain({
                ...w,
                synced: true, // если слово пришло с сервера, то оно в любом случае помечено как синхронизированное
                isDeleted: false, // если слово уже удалено, то оно в любом случае помечено как удаленное
              }),
            );
          this._words$.next(updatedWords);
        });*/
    } // END if online block
  }

  public async createWord(data: CreateWordPayload): Promise<string | null> {
    try {
      // 1. Получаем ID текущего пользователя (или гостя)
      const ownerId = this.session.getOwnerId();
      // ? OwnerId.user(this.authService.userId)
      // : OwnerId.guest('guest_session_id');

      if (!ownerId) {
        this.notificationService.showError('Сессия не инициализирована');
        return null;
      }

      // TODO ?????
      //  this.offlineStorageService.checkWordExists(data.value);

      // 1. Создаем сущность (внутри создадутся VO и ID)
      // 1. Создаем сущность (DDD Logic + Validation)
      const newWord = WordEntity.create(data, OwnerId.from(ownerId));

      // 3. Оптимистичное обновление UI: добавляем в список сразу
      // this.updateLocalState(newWord); // TODO: сделать оптимистичное обновление?????

      // 3. Пытаемся сохранить в Offline Storage IndexedDB
      const wordDto = WordMapper.toPersistence(newWord);
      const entry: OfflineEntry<WordDto> = {
        id: wordDto.id,
        ownerId: ownerId,
        data: wordDto,
        synced: newWord.getProps().metadata.synced ?? true,
        isDeleted: newWord.getProps().metadata.isDeleted || false,
        updatedAt: Date.now(),
      };
      const saveRes = await this.offlineStorageService.save('words', entry);

      // 4. Синхронизируем с сервером / попытка отправить на сервер
      // this.syncWithServer(newWord);
      // const dto = WordMapper.toPersistence(word);
      this.logger.log('saveRes', saveRes);

      if (saveRes && !this.connectivity.isOnline())
        this.notificationService.showWarning(
          'Слово СОХРАНЕНО в оффлайн режиме. Когда вы будете онлайн, слово будет сохранено на сервере.',
        );

      // Сразу обновляем UI (оптимистично)
      this.loadAll();

      // Просим менеджер отправить это на сервер в фоне
      this.syncManager.runSync();

      this.logger.log('Мы онлайн, поэтому пытаемся синхронизировать НОВОЕ слово с сервером', wordDto);

      /** if (this.connectivity.isOnline()) {

        this.wordApiService
          .create(wordDto)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (serverDto) => {
              this.logger.log('Данные из сервера после сохранения', serverDto);
              // Сервер может вернуть финальный ID или дату создания
              const confirmedWord = WordEntity.restore({ ...serverDto, metadata: { synced: true, isDeleted: false } });
              this.replaceInState(newWord.id, confirmedWord);

              this.notificationService.showSuccess(`Word ${newWord.value.value} was synced with server`);

              this.offlineStorageService.markAsSynced('words', confirmedWord.id.value);

              // return new Promise<string | null>(() => confirmedWord.id.value) as unknown as string | null; // return confirmedWord.id.value;
            },
            error: () => {
              // Оставляем как есть, сработает механизм фоновой синхронизации позже
              console.warn('Server sync failed, kept in offline mode');
            },
          });
      }*/

      return newWord.id.value;
    } catch (error: unknown | Error) {
      this.logger.log('Errorrr', error);
      // Здесь мы ловим ошибки из ValueObjects или сущности Word
      this.notificationService.showError((error as Error).message); // TODO  as Error ????
      // throw error; // Пробрасываем ошибку в форму, если нужно подсветить поля
      return null;
    }
  }

  public async updateWord(payload: UpdateWordPayload): Promise<void> {
    try {
      // 1. Получаем запись из IndexedDB
      // Важно: типизируем возвращаемое значение метода getById
      const offlineEntry = await this.offlineStorageService.getById<WordDto>('words', payload.id);
      if (!offlineEntry) throw new Error('Word not found in offline storage');

      // 2. Восстанавливаем сущность из DTO, который лежит в entry.data
      const entity = WordMapper.toDomain({
        ...offlineEntry.data,
        synced: false, // так как обновляем данные, то слово НЕ синхронизировано
        // offlineEntry.synced,
        isDeleted: false, // так как обновляем данные, то слово НЕ удалёно //offlineEntry.isDeleted,
      });

      // 3. Применяем обновления
      const updatedEntity = entity.update(payload);

      this.logger.log('updatedEntity', updatedEntity);

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
      // this.updateLocalWordsState(updatedEntity);
      // Обновляю список слов
      this._words$.next([...this._words$.value]);
      if (!this.connectivity.isOnline())
        this.notificationService.showWarning(
          'Слово ОБНОВЛЕНО ЛОКАЛЬНО в оффлайн режиме. Сеть появится - обновим на сервере.',
        );

      if (this.connectivity.isOnline()) {
        this.wordApiService
          .update(updatedDto)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (dto) => {
              this.logger.log('Слово обновлено на сервере', dto);
              this.replaceInState(updatedEntity.id, WordMapper.toDomain({ ...dto, synced: true, isDeleted: false }));
              this.offlineStorageService.markAsSynced('words', updatedDto.id);
              this.notificationService.showSuccess('Изменения сохранены на сервере');
            },
            error: (error: unknown | Error) => {
              this.notificationService.showError((error as Error).message);
            },
          });
      }
    } catch (error: unknown | Error) {
      this.notificationService.showError((error as Error).message || 'Ошибка при обновлении');
      throw error;
    }
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
    if (navigator.onLine) {
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

  public getWordById(id: string): Observable<WordDto> {
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

    // TODO implement getting word from server

    return localSearch$;
  }

  /**
   * Логика синхронизации только несинхронизированных слов
   */
  public async syncUnsyncedWords(): Promise<void> {
    console.log('>>>>>> WordFacade.syncUnsyncedWords');
    const ownerId = this.session.getOwnerId();
    if (!ownerId) return;

    const unsyncedEntries = (await this.offlineStorageService.getByOwner<WordDto>('words', ownerId)).filter(
      (entry) => !entry.synced,
    );
    if (unsyncedEntries.length > 0) return;

    const deletedEntries = unsyncedEntries
      .map((entry) => (entry.isDeleted ? entry : undefined))
      .filter((e) => e !== undefined);
    for (const entry of deletedEntries) {
      await firstValueFrom(this.wordApiService.delete(entry?.id));
    }

    console.log('unsyncedEntries', unsyncedEntries);
    // 2. Отправляем их на сервер пачкой (или по одному)
    for (const entry of unsyncedEntries) {
      try {
        const wordEntity = WordMapper.toDomain({ ...entry.data, synced: true, isDeleted: entry.isDeleted });
        // const dto = WordMapper.toPersistence(wordEntity);

        // Вызываем API (превращаем Observable в Promise для async/await)
        await firstValueFrom(this.wordApiService.create(entry.data));

        // 3. Если успех — помечаем в локальной базе как синхронизированное
        await this.offlineStorageService.updateSyncStatus('words', entry.id, entry.data, true);

        // const word = WordMapper.toDomain({ ...entry.data, synced: true, isDeleted: entry.isDeleted });
        this.replaceInState(wordEntity.id, wordEntity);

        console.log(`Word ${entry.id} synced successfully`);
      } catch (error) {
        console.error(`Failed to sync word ${entry.id}:`, error);
      }
    }

    this.notificationService.showSuccess('Words synced with server');
  }

  /** синхронизация данных из локальной базы с сервером */
  // private syncWithServer(word: WordEntity): void {
  //   const dto = WordMapper.toPersistence(word);
  //   console.log('syncWith Server', dto);
  //
  //   this.wordApiService
  //     .create(dto)
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe({
  //       next: (serverDto) => {
  //         console.log('syncWith Server next', serverDto);
  //         // Сервер может вернуть финальный ID или дату создания
  //         const confirmedWord = WordEntity.restore(serverDto);
  //         this.replaceInState(word.id, confirmedWord);
  //
  //         this.notificationService.showSuccess('Word synced with server');
  //         // TODO Тут можно обновить статус в IndexedDB на synced: true
  //         this.offlineStorageService.markAsSynced('words', confirmedWord.id.value);
  //       },
  //       error: () => {
  //         // Оставляем как есть, сработает механизм фоновой синхронизации позже
  //         console.warn('Server sync failed, kept in offline mode');
  //       },
  //     });
  // }

  // private updateLocalWordsState(word: WordEntity): void {
  //   this._words$.next([...this._words$.value, word]);
  // }

  // TODO implement method - check method!!!
  public replaceInState(id: WordId, word: WordEntity): void {
    console.log('replaceInState', word);
    // if (this._words$.value.length > 0) {
    const updatedWords = this._words$.value.map((w) => {
      // console.log('replaceInState', w.id.value, id.value);
      // обновляем только те слова, которые совпадают по id, остальные оставляем
      return w.id.value === id.value ? word : w;
    });
    // console.log('replaceInState', updatedWords);

    // this._words$.next([...updatedWords]);
    this._words$.next(updatedWords);
    // } else {
    //   this._words$.next([word]);
    // }
  }

  private clearState(): void {
    console.log('[WordFacade] Session lost, clearing state...');
    this._words$.next([]);
    // Очищаем другие локальные сигналы/субъекты, если они есть
  }

  public updateState(): void {
    console.log('[WordFacade] Update words...');
    this._words$.next([...this._words$.value]);
  }

  /**
   * 5. Удаление (Soft Delete)
   */
  public async deleteWord(wordId: string): Promise<void> {
    console.log('[WordFacade] Delete word', wordId);
    // const currentWords = this._words$.value;
    // this._words$.next(currentWords.filter((w) => w.id.value !== wordId));

    // Ставим флаги isDeleted: true и synced: false
    await this.offlineStorageService.markForDeletion('words', wordId);

    // Мгновенно скрываем из UI
    this.loadAll();

    // Запускаем синхронизацию удаления
    this.syncManager.runSync();
  }
}
