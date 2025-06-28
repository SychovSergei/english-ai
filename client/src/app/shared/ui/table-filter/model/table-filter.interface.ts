// import { WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FilterServiceInterface {
  // getFilter(filterId: string): WritableSignal<string>;
  getFilterStream(filterId: string): Observable<string>;
  initFilter(filterId: string, filterValue: string): BehaviorSubject<string>;
  changeFilterValue(filterId: string, filterValue: string): void;
}

// export interface ITableFilter {
//   filterId: string;
//   filterValue: string;
// }
