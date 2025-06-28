import { Word } from '@entities/word';
import { WordSet, WordSetSettings } from '@entities/word-set';
import { WordItem, WordItemIsNew } from '@entities/word-set/models';

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type MakeOptionalStrict<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] | undefined };

/** DTO от сервера при получении */
export type WordSetResponseDto = WordSet<Word>;

/** DTO для создания нового набора */
type WordItemWithoutId = Omit<WordItem, 'id'>;
export type CreateWordSetDto = Omit<WordSet<WordItemWithoutId>, 'id' | 'ownerId'>;

/** DTO для обновления существующего */
type WordItemWithPartialId = MakeOptional<WordItemIsNew, 'id'>;
export type UpdateWordSetDto = Partial<Omit<WordSet<WordItemWithPartialId>, 'id' | 'ownerId'>> & {
  id: string;
};

// const ddd: UpdateWordSetDto = { words: [{ term: '', definition: '' }] };

/** DTO только для настроек */
export type WordSetSettingsDto = WordSetSettings;

/** DTO для добавления/редактирования слова */
// export type WordDto = Word;
