import { Sort, SortDirection } from '@angular/material/sort';

export type ISort = Sort;
export type ISortTableDirection = SortDirection;

export interface ISortTable extends ISort {
  /** The id of the column being sorted. */
  active: string;
  /** The sort direction. */
  direction: ISortTableDirection;
}
