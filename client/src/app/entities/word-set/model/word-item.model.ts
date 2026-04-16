export interface WordItem {
  id: string | null;
  term: string;
  definition: string;
}

export interface WordItemIsNew extends WordItem {
  isNew: boolean;
}
