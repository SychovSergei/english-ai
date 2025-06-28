import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// import { signal } from '@angular/core';
import { FilterServiceInterface } from '../model/table-filter.interface';

@Injectable({
  providedIn: 'root', // Определяет, что сервис будет доступен в корне приложения
})
export class TableFilterService implements FilterServiceInterface {
  // private _filters = new Map<string, WritableSignal<string>>();
  private _filters = new Map<string, BehaviorSubject<string>>();

  constructor() {}

  // Создаём новый фильтр для каждого фильтра по его идентификатору
  // getFilter(filterId: string): WritableSignal<string> {
  // getFilter(filterId: string): Observable<string> {
  getFilterStream(filterId: string): Observable<string> {
    return this.initFilter(filterId).asObservable();
  }

  // Устанавливаем значение фильтра
  changeFilterValue(filterId: string, filterValue: string): void {
    this.initFilter(filterId).next(filterValue);
  }

  initFilter(filterId: string): BehaviorSubject<string> {
    if (!this._filters.has(filterId)) {
      this._filters.set(filterId, new BehaviorSubject(''));
    }

    return this._filters.get(filterId)!;
  }

  showFilters(): void {
    console.log(this._filters.entries());
  }
}
