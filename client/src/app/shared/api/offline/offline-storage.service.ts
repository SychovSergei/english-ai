import { LoggerService } from '@shared/lib/logger/logger.service';
import Dexie, { Table } from 'dexie';

import { inject, Injectable } from '@angular/core';

export type OfflineTablesNameList = 'words' | 'wordSets' | 'userProfile';

// Структура записи в IndexedDB
export interface OfflineEntry<TData = unknown> {
  id: string;
  ownerId: string; // ОБЯЗАТЕЛЬНО для фильтрации для разных клиентов на одном устройстве
  data: TData; // DTO // Здесь лежит WordDto
  synced: boolean;
  isDeleted: boolean;
  updatedAt: number;
}

class AppDb extends Dexie {
  words!: Table<OfflineEntry>; //<WordDto>
  wordSets!: Table<OfflineEntry>;

  constructor() {
    super('EnglishAppDb');
    this.version(3).stores({
      // ownerId важен для фильтрации, data.value для поиска омонимов
      words: 'id, [synced+ownerId], ownerId, synced, isDeleted, data.value', // Индексы для быстрого поиска // Добавляем индекс 'data.value' для быстрого поиска омонимов
      wordSets: 'id, synced',
      userProfile: 'id, synced',
    });
  }
}

@Injectable({ providedIn: 'root' })
export class OfflineStorageService /* extends AppDb*/ {
  private readonly loggerService = inject(LoggerService).createLogger('OfflineStorageService');

  private db = new AppDb();

  constructor() {
    // super();
  }

  /**
   * Вспомогательный метод для получения типизированной таблицы.
   * Избавляет нас от использования any во всем сервисе.
   */
  private getTable<TData>(tableName: OfflineTablesNameList): Table<OfflineEntry<TData>, string> {
    // Мы принудительно приводим к типу, так как доверяем нашей схеме в AppDb
    return this.db.table(tableName) as Table<OfflineEntry<TData>, string>;
  }

  /**
   *  Clear data in table
   */
  public clear(tableName: OfflineTablesNameList): void {
    // Clear data in table
    (this.db.table(tableName) as Table<OfflineEntry, string>).clear();
  }

  async getByOwner<TData>(table: OfflineTablesNameList, ownerId: string): Promise<OfflineEntry<TData>[]> {
    return (await this.db
      .table(table)
      .where('ownerId')
      .equals(ownerId)
      .filter((item) => !item.isDeleted) // ignore deleted
      .toArray()) as unknown as OfflineEntry<TData>[];
  }

  async getById<TData>(table: OfflineTablesNameList, id: string): Promise<OfflineEntry<TData> | undefined> {
    // const obj = (await this.db[table].where('data.id').equals(id)) as unknown as OfflineEntry<TData>;
    // const obj = (await this.db.table(table).where('id').equals(id)) as unknown as OfflineEntry<TData>;
    // .get(id) — самый быстрый способ получения по PK
    const obj = (await this.db.table(table).get(id)) as unknown as OfflineEntry<TData> | undefined;
    this.loggerService.log('getById', id, obj);

    return obj;
  }

  // async save<TData>(table: OfflineTablesNameList, ownerId: string, id: string, data: TData): Promise<string> {
  // async save<TData>(table: OfflineTablesNameList, ownerId: string, id: string, data: TData): Promise<string> {
  async save<TData>(table: OfflineTablesNameList, entry: OfflineEntry<TData>): Promise<string> {
    // const entry: OfflineEntry<TData> = { id, ownerId, data, synced: false, isDeleted: false, updatedAt: Date.now() };
    const resWordId = await this.db.table(table).put(entry);

    return resWordId as string;
  }

  async update<TData>(table: OfflineTablesNameList, ownerId: string, id: string, data: TData): Promise<number> {
    const entry: OfflineEntry<TData> = { id, ownerId, data, synced: false, isDeleted: false, updatedAt: Date.now() };
    // console.log('Trying to save:', JSON.parse(JSON.stringify(entry)));
    // const ddd = await this.db[table].put(entry);
    const updatedRows = await this.db.table(table).update(id, { ...entry });
    // const ddd = await this.getTable(table).put(entry);
    this.loggerService.log('updatedRows', updatedRows);
    return updatedRows;
  }

  // async updateSyncStatus<TData = unknown>(
  async updateSyncStatus<TData>(
    table: OfflineTablesNameList,
    id: string,
    data: TData,
    synced: boolean,
  ): Promise<number> {
    // return this.db.words.update(id, { data, synced });
    return this.db.table(table).update(id, { data, synced, updatedAt: Date.now() }); // TODO check 'update' method signature values

    // TODO check modify method (unknown method, prediction)))))
    // return this.db.words.where('id').equals(id).modify({ synced }); //update({ synced });
    //await this.db.words.put({ id, data, synced });
  }
  // async saveWord(word: WordDto): Promise<string> {
  //   return await this.db.words.put(word);
  // }

  async findAllByValue<TData = unknown>(
    table: OfflineTablesNameList,
    ownerId: string,
    value: string,
  ): Promise<OfflineEntry<TData>[]> {
    // const compoundKeys = values.map((val) => [ownerId, val]);

    // return (await this.db[table]
    //   .where('data.value')
    //   .equals(value)
    //   .and((item) => item.ownerId === ownerId)
    //   .toArray()) as unknown as OfflineEntry<TData>[];

    return (await this.getTable<TData>(table)
      .where('data.value')
      .equals(value)
      .and((item) => item.ownerId === ownerId)
      .toArray()) as unknown as OfflineEntry<TData>[];
  }

  markAsSynced(table: OfflineTablesNameList, id: string): void {
    this.loggerService.log('markAsSynced', id, table);
    this.db.table(table).update(id, { synced: true });
  }

  markAsUnsynced(table: OfflineTablesNameList, id: string): void {
    this.loggerService.log('markAsUnsynced', id, table);
    this.db.table(table).update(id, { synced: false });
  }

  /**
   * async getDataByOwner<TData>(table: OfflineTablesNameList, ownerId: string): Promise<TData[]> {
   * // return await this.db[table].where('data.ownerId').equals(ownerId).toArray();
      return ((await this.db[table].where('ownerId').equals(ownerId).toArray()) as unknown as OfflineEntry<TData>[]).map(
        (w) => w.data,
      );
    }
   */

  async getUnsyncedForActor<TData>(table: OfflineTablesNameList, ownerId: string): Promise<OfflineEntry<TData>[]> {
    /*const res = (await this.db
      .table(table)
      .where('[synced+ownerId]')
      .equals([0, ownerId]) // 0 обычно используется для false в индексах Dexie
      // .and((entry) => entry.ownerId === ownerId)
      .toArray()) as unknown as OfflineEntry<TData>[];
    console.log('getUnsyncedForActor res >>>>>>', res);*/
    return (await this.db
      .table(table)
      .filter((item) => item.synced === false && item.ownerId === ownerId)
      .toArray()) as unknown as OfflineEntry<TData>[];
  }

  async getDeleted<TData>(table: OfflineTablesNameList, ownerId: string): Promise<OfflineEntry<TData>[]> {
    return (await this.db
      .table(table)
      .where('ownerId')
      .equals(ownerId)
      .and((entry) => entry.isDeleted === true)
      .toArray()) as unknown as OfflineEntry<TData>[];
  }

  async markForDeletion(table: OfflineTablesNameList, id: string): Promise<void> {
    await this.db.table(table).update(id, { synced: false, isDeleted: true, updatedAt: Date.now() });
  }

  async permanentlyDelete(table: OfflineTablesNameList, id: string): Promise<void> {
    await this.db.table(table).delete(id);
  }
}
