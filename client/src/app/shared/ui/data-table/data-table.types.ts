import { Sort, SortDirection } from '@angular/material/sort';

export type ISort = Sort;
export type ISortTableDirection = SortDirection;

export interface SortTable extends Sort {
  /** The id of the column being sorted. */
  active: string;
  /** The sort direction. */
  direction: SortDirection;
}
