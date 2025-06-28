import { Word } from '@entities/word';

export interface OpenDialogWordData {
  data: Word;
  mode: WordActionMode;
}

export type WordActionMode = 'create' | 'edit';
