export type ISortDirection = 'asc' | 'desc' | '';

export interface TableCommonParamsRequest {
  filter: string;
  limit: number;
  offset: number;
  sortName: string;
  sortDirection: ISortDirection;
}
