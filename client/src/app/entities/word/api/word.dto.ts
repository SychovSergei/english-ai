import { Word } from '@entities/word';
import { WordTranslation } from '@entities/word/model/word.types';

export type CreateWordDTO = Pick<Word, 'id' | 'text' | 'language' | 'translations'>;
export type UpdateWordDTO = WordPatchPayload;

export type WordPatchPayload = Partial<Omit<Word, 'translations'>> & {
  translations: PatchChange<WordTranslation>;
};

export type WithId = { id: string };

export type PatchChange<T extends WithId> = {
  created: Omit<T, 'id'>[];
  updated: Partial<T>[];
  deleted: Pick<T, 'id'>[];
};
