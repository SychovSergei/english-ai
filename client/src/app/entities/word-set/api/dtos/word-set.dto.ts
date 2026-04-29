import { WordSet } from '@entities/word-set';
import { WordSetSettings } from '@entities/word-set/model';

// Базовые поля, общие для всех
interface WordSetBase {
  readonly title: string;
  readonly description: string;
  readonly settings: WordSetSettings; // Плоский объект настроек
}

export interface WordSetDto extends WordSetBase {
  readonly id: string;
  readonly ownerId: string;
  readonly wordIds: string[]; // Ссылки по ID
  readonly updatedAt?: number;
}

/** for create entity */
export type CreateWordSetPayload = WordSetBase & {
  readonly wordIds?: string[];
};

/** for update entity */
export type UpdateWordSetPayload = WordSetBase & {
  readonly id: string;
  readonly wordIds: string[];
};

/** DTO от сервера при получении */
export type WordSetResponseDto = WordSet;

// export type CreateWordSetDto = Omit<WordSet, 'id' | 'ownerId'>;

// export type UpdateWordSetDto = Partial<Omit<WordSet, 'id' | 'ownerId'>> & {
//   id: string;
// };
